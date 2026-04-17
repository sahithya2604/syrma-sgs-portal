import Types "../types/documents";
import List "mo:core/List";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Blob "mo:core/Blob";
import Nat8 "mo:core/Nat8";

module {
  // Supported plain-text extensions that can be decoded directly
  let textExtensions : [Text] = [".txt", ".md", ".csv"];

  public func isSupportedFileType(filename : Text) : Bool {
    let lower = filename.toLower();
    textExtensions.any(func(ext : Text) : Bool { lower.endsWith(#text ext) })
    or lower.endsWith(#text ".pdf")
    or lower.endsWith(#text ".docx")
    or lower.endsWith(#text ".doc");
  };

  public func isTextFileType(filename : Text) : Bool {
    let lower = filename.toLower();
    textExtensions.any(func(ext : Text) : Bool { lower.endsWith(#text ext) });
  };

  // Build an AI prompt given filename and decoded text content
  public func buildAiPrompt(filename : Text, content : Text) : Text {
    "You are a document analysis assistant. Please provide a concise, clear summary of the following document.\n\n"
    # "Filename: " # filename # "\n\n"
    # "Document content:\n" # content # "\n\n"
    # "Provide a summary in 3-5 sentences covering the main topics and key information.";
  };

  public func buildAiBinaryPrompt(filename : Text, base64Content : Text) : Text {
    "You are a document analysis assistant. The following is a base64-encoded document file.\n\n"
    # "Filename: " # filename # "\n\n"
    # "Base64 encoded content (first 2000 chars):\n" # base64Content # "\n\n"
    # "Based on the filename and any readable text within the encoded content, provide a brief summary of what this document likely contains, in 2-4 sentences.";
  };

  public func storeSummary(
    summaries : List.List<Types.SummaryRecord>,
    nextId : Nat,
    filename : Text,
    customName : Text,
    customerName : Text,
    summary : Text,
    timestamp : Types.Timestamp,
    source : Text,
  ) : Nat {
    let record : Types.SummaryRecord = {
      id = nextId;
      filename;
      customName;
      customerName;
      summary;
      timestamp;
      source;
    };
    summaries.add(record);
    nextId + 1;
  };

  // Returns summaries sorted by most recent first (highest timestamp first)
  public func getSummaries(summaries : List.List<Types.SummaryRecord>) : [Types.SummaryRecord] {
    let arr = summaries.toArray();
    arr.sort(func(a : Types.SummaryRecord, b : Types.SummaryRecord) : { #less; #equal; #greater } {
      if (b.timestamp > a.timestamp) { #less }
      else if (b.timestamp < a.timestamp) { #greater }
      else { #equal }
    });
  };

  // Returns summaries for a specific source, sorted by most recent first
  public func getSummariesBySource(summaries : List.List<Types.SummaryRecord>, source : Text) : [Types.SummaryRecord] {
    let all = getSummaries(summaries);
    all.filter(func(r : Types.SummaryRecord) : Bool { r.source == source });
  };

  // Returns summaries for a specific customer name, sorted by most recent first
  public func getSummariesByCustomer(summaries : List.List<Types.SummaryRecord>, customerName : Text) : [Types.SummaryRecord] {
    let all = getSummaries(summaries);
    all.filter(func(r : Types.SummaryRecord) : Bool { r.customerName == customerName });
  };

  // Base64 encode a Blob (capped at first 1500 bytes for AI prompts)
  public func base64Encode(data : Blob) : Text {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let charsArr = chars.toArray();
    let bytes = data.toArray();
    let len = bytes.size();
    var result = "";
    var i = 0;
    let limit = if (len > 1500) 1500 else len;
    while (i + 2 < limit) {
      let b0 = bytes[i].toNat();
      let b1 = bytes[i + 1].toNat();
      let b2 = bytes[i + 2].toNat();
      let idx0 = b0 / 4;
      let idx1 = (b0 % 4) * 16 + b1 / 16;
      let idx2 = (b1 % 16) * 4 + b2 / 64;
      let idx3 = b2 % 64;
      result #= Text.fromChar(charsArr[idx0]);
      result #= Text.fromChar(charsArr[idx1]);
      result #= Text.fromChar(charsArr[idx2]);
      result #= Text.fromChar(charsArr[idx3]);
      i += 3;
    };
    if (i + 1 < limit) {
      let b0 = bytes[i].toNat();
      let b1 = bytes[i + 1].toNat();
      let idx0 = b0 / 4;
      let idx1 = (b0 % 4) * 16 + b1 / 16;
      let idx2 = (b1 % 16) * 4;
      result #= Text.fromChar(charsArr[idx0]);
      result #= Text.fromChar(charsArr[idx1]);
      result #= Text.fromChar(charsArr[idx2]);
      result #= "=";
    } else if (i < limit) {
      let b0 = bytes[i].toNat();
      let idx0 = b0 / 4;
      let idx1 = (b0 % 4) * 16;
      result #= Text.fromChar(charsArr[idx0]);
      result #= Text.fromChar(charsArr[idx1]);
      result #= "==";
    };
    result;
  };
};
