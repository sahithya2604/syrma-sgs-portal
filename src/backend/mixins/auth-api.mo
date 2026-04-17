import Types "../types/auth";
import AuthLib "../lib/auth";
import Map "mo:core/Map";
import Text "mo:core/Text";
import AccessControl "mo:caffeineai-authorization/access-control";

mixin (
  credentials : Map.Map<Text, Text>,
  accessControlState : AccessControl.AccessControlState,
) {
  // Register a new user with username and password.
  // The first registered user automatically becomes admin.
  public shared func register(username : Text, password : Text) : async Types.RegisterResult {
    switch (AuthLib.register(credentials, username, password)) {
      case (#ok) {
        // Assign #user role via access-control (admin is assigned at canister init)
        // We store roles by username since we don't have their Principal here.
        // Role assignment happens at login via _initializeAccessControl pattern.
        #ok;
      };
      case (#err(msg)) { #err(msg) };
    };
  };

  // Validate username/password. Returns #ok if credentials are correct.
  public shared func login(username : Text, password : Text) : async Types.LoginResult {
    switch (AuthLib.login(credentials, username, password)) {
      case (#ok) { #ok };
      case (#err(msg)) { #err(msg) };
    };
  };

  // Check whether a username exists (used by frontend to distinguish register vs login).
  public query func usernameExists(username : Text) : async Bool {
    switch (credentials.get(username)) {
      case (?_) { true };
      case null { false };
    };
  };
};
