import Common "common";

module {
  public type Timestamp = Common.Timestamp;

  public type SummaryRecord = {
    id : Nat;
    filename : Text;
    customName : Text;
    customerName : Text; // customer name selected at upload time
    summary : Text;
    timestamp : Timestamp;
    source : Text;
  };

  public type UploadResult = {
    #ok : Text;
    #err : Text;
  };
};
