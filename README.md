# miniprojectbe

(REQUIREMENT)
#Authorization & Authentication
As a non-registered user, I want to input my data, so that I can register as a user
As a user, I want to be able to verify my account
As a user, I want to input my account and password, so that I can login to the web app
As a user, I want to be able to change my password
As a user, I want to be able to reset my password
As a non-registered user, I can view blogs only

#Profiling
As a user, I want to update my personal data such as username, email or phone number
As a user, I want to update my profile picture

#Blogging
As a verified user, I can create blog
As a user, I want to see all blog
As a user, I want to see a blog
As a user, I can filter and sort blog

refactoring : tambah folder service atau query, trgantung yg di refactor apa

---

(SECNARIO)
#AUTH
userRegistration
As a user, I can successfully regist my account and got email verification included token
As a user, I can't regist using existing username
As a user, I can't regist using existing email
As a user, I can't regist using invalid email format
As a user, I can't regist using existing phone
As a user, I can't regist using invalid phone format
As a user, I can't regist using invalid password format less than 6 char
As a user, I can't regist using invalid password format no capital char
As a user, I can't regist using invalid password format no symbol
As a user, I can't regist using not matched password and confirm password

userVerify
As a user, I can successfully verify my registered account using token from email (regist token)
As a user, I can't verify my registered account using invalid token

userLogin
As a user, I can successfully login
As a user, I can't login using not registered user
As a user, I can't login using not verified user
As a user, I can't login using invalid password

#PASSWORD
changePassword
As a user, I can successfully change my password and got email
As a user, I can successfully login using new password
As a user, I can't change my password using invalid token
As a user, I can't change my password using wrong currentPassword
As a user, I can't change my password using invalid password format
As a user, I can't change my password using not matched password and confirm password

forgotPassword
As a user, I can successfully send email included token for reset password
As a user, I can't send email using invalid email format

resetPassword
As a user, I can successfully reset my password using token from email (resetPassword token)
As a user, I can successfully login using new password
As a user, I can't reset my password using invalid token
As a user, I can't reset my password using invalid password format
As a user, I can't reset my password using not matched password and confirm password

#PROFILE
changeUsername
As a user, I can successfully change my username using login token
As a user, I can't change my username using invalid token
As a user, I can't change my username using wrong currentUsername
As a user, I can't change my username using existing newUsername

changeEmail
As a user, I can successfully change email using login token and got email included change email token
As a user, I can't change my email using invalid token
As a user, I can't change my email using wrong currentEmail
As a user, I can't change my email using existing newEmail
As a user, I can't change my email using invalid email format

verifyChangeEmail
As a user, I can successfully change my email using token from email (change email token)
As a user, I can't change my email using invalid token

changePhone
As a user, I can successfully change my phone using login token
As a user, I can't change my phone using invalid token
As a user, I can't change my phone using wrong currentPhone
As a user, I can't change my phone using existing newPhone
As a user, I can't change my phone using invalid phone format

changeAvatar
As a user, I can successfully change my avatar using login token
As a user, I can't change my avatar using invalid token
As a user, I can't change my avatar using invalid extension (allowed jpg, png, gif)
As a user, I can't change my avatar using file more than 1MB

createBlog
As a user, I can successfully create a blog using login token
As a user, I can't create a blog using invalid token
As a user, I can't create a blog using invalid data
As a user, I can't create a blog using invalid blogImage extension

getAllBlog
As a user, I can successfully get all blogs with default 10 blog without token
As a user, I can successfully get all blogs with pageSize and pageNumber
As a user, I can successfully get all blogs according to blog category
As a user, I can successfully get all blogs according to blog title
As a user, I can successfully sort blogs according to sort method

getBlog
As a user, I can successfully get a blog data using blog id
