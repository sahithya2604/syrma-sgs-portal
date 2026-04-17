module {
  public type Credential = {
    username : Text;
    // SHA-256 hex digest of the password
    passwordHash : Text;
  };

  public type LoginResult = {
    #ok;
    #err : Text;
  };

  public type RegisterResult = {
    #ok;
    #err : Text;
  };
};
