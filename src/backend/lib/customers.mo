import Types "../types/customers";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public func saveCustomer(
    customers : List.List<Types.CustomerRecord>,
    name : Text,
    source : Text,
  ) : Types.SaveCustomerResult {
    // Check for duplicate name within same source
    let existing = customers.find(func(c : Types.CustomerRecord) : Bool {
      c.name == name and c.source == source
    });
    switch (existing) {
      case (?_) { #err("Customer already exists") };
      case null {
        let record : Types.CustomerRecord = {
          id = name # "-" # source;
          name;
          source;
          timestamp = Time.now();
        };
        customers.add(record);
        #ok(record);
      };
    };
  };

  public func getCustomers(
    customers : List.List<Types.CustomerRecord>,
    source : Text,
  ) : [Types.CustomerRecord] {
    let arr = customers.toArray();
    arr.filter(func(c : Types.CustomerRecord) : Bool { c.source == source });
  };

  public func getAllCustomers(
    customers : List.List<Types.CustomerRecord>,
  ) : [Types.CustomerRecord] {
    customers.toArray();
  };
};
