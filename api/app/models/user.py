from pydantic import BaseModel, EmailStr, SecretStr

class UserBase(BaseModel):
    name: str
    email: EmailStr
    password: SecretStr

class UserCreate(UserBase):
    confirm_password: SecretStr
    pass

class UserResponse(UserBase):
    id: str
    email: EmailStr
    name: str

class UserListResponse():
    __init__: (list[UserResponse], dict)
    users: list[UserResponse]
