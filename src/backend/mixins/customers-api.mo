import Types "../types/customers";
import CustomerLib "../lib/customers";
import List "mo:core/List";

mixin (
  customers : List.List<Types.CustomerRecord>,
) {
  public shared func saveCustomer(name : Text, source : Text) : async Types.SaveCustomerResult {
    CustomerLib.saveCustomer(customers, name, source);
  };

  public query func getCustomers(source : Text) : async [Types.CustomerRecord] {
    CustomerLib.getCustomers(customers, source);
  };

  public query func getAllCustomers() : async [Types.CustomerRecord] {
    CustomerLib.getAllCustomers(customers);
  };
};
