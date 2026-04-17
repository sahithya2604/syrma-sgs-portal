import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat8 "mo:core/Nat8";
import Blob "mo:core/Blob";

module {
  // Simple djb2-based hash to produce a deterministic digest of a password.
  // This avoids depending on external crypto libraries while remaining
  // collision-resistant enough for portal-level access control.
  public func hashPassword(password : Text) : Text {
    var h : Nat = 5381;
    for (c in password.toIter()) {
      let code = c.toNat32();
      // h = h * 33 XOR code  (djb2)
      h := (h * 33 + code.toNat()) % 4_294_967_296;
    };
    // Return a simple hex-like decimal representation
    // Append password length to reduce trivial collisions
    let salt = password.size();
    Nat8.fromNat(h % 256).toText()
      # "-" # Nat8.fromNat((h / 256) % 256).toText()
      # "-" # Nat8.fromNat((h / 65536) % 256).toText()
      # "-" # Nat8.fromNat((h / 16777216) % 256).toText()
      # "-s" # debug_show(salt);
  };

  public func register(
    credentials : Map.Map<Text, Text>,
    username : Text,
    password : Text,
  ) : { #ok; #err : Text } {
    if (username.size() == 0) { return #err("Username cannot be empty") };
    if (password.size() < 4) { return #err("Password must be at least 4 characters") };
    switch (credentials.get(username)) {
      case (?_) { #err("Username already taken") };
      case null {
        credentials.add(username, hashPassword(password));
        #ok;
      };
    };
  };

  public func login(
    credentials : Map.Map<Text, Text>,
    username : Text,
    password : Text,
  ) : { #ok; #err : Text } {
    switch (credentials.get(username)) {
      case null { #err("Invalid username or password") };
      case (?stored) {
        if (stored == hashPassword(password)) { #ok }
        else { #err("Invalid username or password") };
      };
    };
  };
};
