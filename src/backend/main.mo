import DocTypes "types/documents";
import CustTypes "types/customers";
import DocumentsApi "mixins/documents-api";
import CustomersApi "mixins/customers-api";
import AuthApi "mixins/auth-api";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import List "mo:core/List";
import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";



actor {
  let summaries = List.empty<DocTypes.SummaryRecord>();
  let customers = List.empty<CustTypes.CustomerRecord>();

  // Auth state: username -> hashed password
  let credentials = Map.empty<Text, Text>();
  let accessControlState = AccessControl.initState();

  include DocumentsApi(summaries);
  include CustomersApi(customers);
  include AuthApi(credentials, accessControlState);
  include MixinAuthorization(accessControlState);
};
