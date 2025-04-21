from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, SubmitField, IntegerField, FieldList, FormField, PasswordField, BooleanField
from wtforms.validators import DataRequired, Length, Email, EqualTo, ValidationError
from flask_login import current_user
from jeevika_agent.models import Agent

class MedicineForm(FlaskForm):
    medicine_id = IntegerField('Medicine ID',
                           validators=[DataRequired()])
    stock_count = IntegerField('Stock', validators=[DataRequired()])
    address = IntegerField('Position',
                                     validators=[DataRequired()])

class InventoryForm(FlaskForm):
    machine_id = IntegerField('Machine ID',
                           validators=[DataRequired()])
    inputfield = FieldList(FormField(MedicineForm),min_entries=4)
    submit = SubmitField('Submit')

class LoginForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired()])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Login')

class RequestResetForm(FlaskForm):
    email = StringField("Email", validators=[DataRequired(), Email()])
    submit = SubmitField('Request Reset')

    def validate_email(self,email):
        email = Agent.query.filter_by(email = email.data).first()
        if email is None:
            raise ValidationError("Account doesnt exist!")
            
class ResetPasswordForm(FlaskForm):
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password',
                                     validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Reset Password')


class UpdateAccountForm(FlaskForm):
    username = StringField('Username',
                           validators=[DataRequired(), Length(min=2, max=20)])
    email = StringField('Email',
                        validators=[DataRequired(), Email()])
    picture = FileField('Profile', validators=[FileAllowed(['jpg','png'])])                
    submit = SubmitField('Update')

    def validate_username(self,username):
        if username.data != current_user.username:
            username = Agent.query.filter_by(username = username.data).first()
            if username:
                raise ValidationError("Username already exist! Please choose another one")
    def validate_email(self,email):
        if email.data != current_user.email:
            email = Agent.query.filter_by(email = email.data).first()
            if email:
                raise ValidationError("Email already exist!")
