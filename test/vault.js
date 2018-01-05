let assert = require("assert")
let Contract = require("./contract")

describe("test vault contract", function(){
  var hashToTrace = null

  it("should create successfully", function(done){
    const file = "./contracts/024_vault.bbo"
    let testContract = new Contract(this.web3, file)
    this.primaryAccount = this.accounts[0]
    this.secondaryAccount = this.accounts[1]
    this.hotWallet = this.accounts[2]
    testContract.deploy({
      from: this.primaryAccount,
      arguments: [ this.primaryAccount, this.secondaryAccount ]
    })
    .then((contractInstance) => {
      this.contractInstance = contractInstance
      done()
    })
  })

  it("should accept money", function(done){
    this.web3.eth.sendTransaction({
      to: this.contractInstance.address,
      from: this.primaryAccount,
      value: 1000
    }, done)
  })

  it("should unvault", function(done){
    this.contractInstance.methods.unvault(100, this.hotWallet).send({from: this.primaryAccount, gas: 6721975}, function(err, tx) {
      console.log(tx)
      hashToTrace = tx
      done()
    })
  })

  it("should debug", function(done){
    this.web3.currentProvider.sendAsync({
      jsonrpc: "2.0",
      method: "debug_traceTransaction",
      params: [hashToTrace, []],
      id: new Date().getTime()
    }, function(err, response) {
      console.log(response.result.structLogs)
    })
  })

})
