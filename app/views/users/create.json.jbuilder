json.data do
  json.user do
    json.id @user.id
    json.email @user.email
    json.token @user.authentication_token
  end
end
