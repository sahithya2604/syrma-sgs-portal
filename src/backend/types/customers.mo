import Common "common";

module {
  public type Timestamp = Common.Timestamp;

  public type CustomerRecord = {
    id : Text;
    name : Text;
    source : Text; // "client" or "vendor"
    timestamp : Timestamp;
  };

  public type SaveCustomerResult = {
    #ok : CustomerRecord;
    #err : Text;
  };
};
