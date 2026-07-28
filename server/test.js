import dns from "dns";

dns.resolveSrv(
  "_mongodb._tcp.cluster0.wfis3fn.mongodb.net",
  (err, records) => {
    if (err) {
      console.log("DNS ERROR:", err);
    } else {
      console.log("DNS SUCCESS:", records);
    }
  }
);