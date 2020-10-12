# (c) 2020 Greenwood
# @title Greenwood Core
# @author Brandon McFarland (Attribution: Max Wolff, http://maxcwolff.com/rhoSpec.pdf)
# @notice An automated market maker for cryptocurrency interest rate swaps

interface TOKEN:
    def balanceOf(_user: address) -> uint256: view
    def transfer(_to: address, _value: uint256) -> bool: nonpayable
    def transferFrom(_from: address, _to: address, _value: uint256) -> bool: nonpayable

interface COMPOUND:
    def supplyRatePerBlock() -> uint256: view

CONTRACT_PRECISION: constant(decimal) = .0000000001
daysInYear: constant(decimal) = 360.0
blocksPerDay: constant(decimal) = 5760.0
decimalZero: constant(decimal) = 0.0
secondsPerDay: constant(decimal) = 86400.0
ETH_PRECISION: constant(decimal) = 1000000000000000000.0

struct liquidityAccountStruct:
    amount: decimal
    lastDepositTime: decimal
    depositSupplyIndex: decimal

struct swapStruct:
    swapType: String[4]
    notional: decimal
    initTime: decimal
    swapRate: decimal
    owner: address
    initIndex: decimal
    userCollateral: decimal
    orderNumber: uint256

struct liquidityAccountReturnStruct:
    amount: int128
    lastDepositTime: int128
    depositSupplyIndex: int128

struct swapReturnStruct:
    notional: int128
    initTime: int128
    swapRate: int128
    initIndex: int128
    userCollateral: int128

struct stateStruct:
    admin: address
    mantissa: int128
    yOffset: int128
    slopeFactor: int128
    rateFactorSensitivity: int128
    feeBase: int128
    feeSensitivity: int128
    minPayoutRate: int128
    maxPayoutRate: int128
    lastCheckpointTime: int128
    avgFixedRateReceiving: int128
    notionalReceivingFixed: int128
    avgFixedRatePaying: int128
    notionalPayingFixed: int128
    notionalPayingFloat: int128
    lastFloatIndex: int128
    notionalReceivingFloat: int128
    totalLiquidity: int128
    fixedToPay: int128
    fixedToReceive: int128
    supplyIndex: int128
    notionalDaysPayingFloat: int128
    notionalDaysReceivingFloat: int128
    activeCollateral: int128
    swapDuration: int128
    rateFactor: int128
    rateRange: int128
    orderNumber: int128

admin: public(address)
compoundHandle: COMPOUND
tokenHandle: TOKEN
mantissa: decimal
yOffset: decimal
slopeFactor: decimal
rateFactorSensitivity: decimal
feeBase: decimal
feeSensitivity: decimal
minPayoutRate: decimal
maxPayoutRate: decimal
lastCheckpointTime: decimal
avgFixedRateReceiving: decimal
notionalReceivingFixed: decimal
avgFixedRatePaying: decimal
notionalPayingFixed:decimal
notionalPayingFloat: decimal
lastFloatIndex: decimal
notionalReceivingFloat: decimal
totalLiquidity: decimal
fixedToPay: decimal
fixedToReceive: decimal
supplyIndex: decimal
notionalDaysPayingFloat: decimal
notionalDaysReceivingFloat: decimal
activeCollateral: decimal
swapDuration: decimal
rateFactor: decimal
rateRange: decimal
orderNumber: uint256
isPaused: bool
liquidityAccounts: HashMap[address, liquidityAccountStruct]
swaps: HashMap[bytes32, swapStruct]
swapNumbers: public(HashMap[address, uint256])

@external
def __init__( _admin: address, _compound_addr:address, _token_addr:address, _mantissa: uint256, _y_offset: uint256, _slope_factor:uint256, _rate_factor_sensitivity: uint256, _fee_base: uint256, _fee_sensitivity: uint256, _range: uint256, _min_payout_rate: uint256, _max_payout_rate:uint256, _swap_duration: uint256, _initial_float_index: uint256, _supply_index: uint256):
    self.admin = _admin
    self.compoundHandle = COMPOUND(_compound_addr)
    self.tokenHandle = TOKEN(_token_addr)
    self.mantissa = convert(_mantissa, decimal)
    self.yOffset = convert(_y_offset, decimal) * CONTRACT_PRECISION
    self.slopeFactor = convert(_slope_factor, decimal) * CONTRACT_PRECISION
    self.rateFactorSensitivity = convert(_rate_factor_sensitivity, decimal) * CONTRACT_PRECISION
    self.feeBase = convert(_fee_base, decimal) * CONTRACT_PRECISION
    self.feeSensitivity = convert(_fee_sensitivity, decimal) * CONTRACT_PRECISION
    self.rateRange = convert(_range, decimal) * CONTRACT_PRECISION
    self.minPayoutRate = convert(_min_payout_rate, decimal) * CONTRACT_PRECISION
    self.maxPayoutRate = convert(_max_payout_rate, decimal) * CONTRACT_PRECISION
    self.swapDuration = convert(_swap_duration, decimal)
    self.lastFloatIndex = convert(_initial_float_index, decimal) * CONTRACT_PRECISION
    self.supplyIndex = convert(_supply_index, decimal)
    self.orderNumber = 1
    self.isPaused = False
    self.lastCheckpointTime = convert(block.timestamp, decimal)

@external
def updateModel( _y_offset: uint256, _slope_factor:uint256, _rate_factor_sensitivity: uint256, _fee_base: uint256, _fee_sensitivity: uint256, _range: uint256, _min_payout_rate: uint256, _max_payout_rate:uint256, _is_paused: bool):
    assert msg.sender == self.admin
    self.yOffset = convert(_y_offset, decimal) * CONTRACT_PRECISION
    self.slopeFactor = convert(_slope_factor, decimal) * CONTRACT_PRECISION
    self.rateFactorSensitivity = convert(_rate_factor_sensitivity, decimal) * CONTRACT_PRECISION
    self.feeBase = convert(_fee_base, decimal) * CONTRACT_PRECISION
    self.feeSensitivity = convert(_fee_sensitivity, decimal) * CONTRACT_PRECISION
    self.rateRange = convert(_range, decimal) * CONTRACT_PRECISION
    self.minPayoutRate = convert(_min_payout_rate, decimal) * CONTRACT_PRECISION
    self.maxPayoutRate = convert(_max_payout_rate, decimal) * CONTRACT_PRECISION
    self.isPaused = _is_paused

@internal
@view
def getFloatIndex() -> uint256:
    rate: decimal = convert(self.compoundHandle.supplyRatePerBlock(), decimal)
    t0: decimal = rate / ETH_PRECISION * blocksPerDay + convert(1,decimal)
    t1: decimal = t0 * t0
    for i in range(357):
        t1 = t1 * t0
    t2: decimal = t1 - convert(1, decimal)
    t3: decimal = t2 * convert(100,decimal)
    return convert(t3 * ETH_PRECISION, uint256)

@internal
def accrueProtocolCashflow():
    accruedDays: decimal = (convert(block.timestamp, decimal) - self.lastCheckpointTime) / secondsPerDay
    newFloatIndexUint: uint256 = self.getFloatIndex()
    newFloatIndex: decimal = convert(newFloatIndexUint,decimal) / ETH_PRECISION
    fixedReceived: decimal = ((self.avgFixedRateReceiving * self.notionalReceivingFixed * accruedDays) / daysInYear)
    fixedPaid: decimal = ((self.avgFixedRatePaying * self.notionalPayingFixed * accruedDays) / daysInYear)
    floatPaid: decimal = (self.notionalPayingFloat * (newFloatIndex / self.lastFloatIndex - convert(1, decimal)))
    floatReceived: decimal = (self.notionalReceivingFloat * (newFloatIndex / self.lastFloatIndex - convert(1, decimal)))
    profitAccrued: decimal = fixedReceived + floatReceived - fixedPaid - floatPaid
    if self.totalLiquidity == decimalZero:
        profitRate: decimal = decimalZero
        if self.supplyIndex == decimalZero:
            self.supplyIndex = self.supplyIndex * (1.0 + profitRate)
        else:
            self.supplyIndex = self.supplyIndex * (1.0 + profitRate)
    else:
        profitRate: decimal = (profitAccrued / self.totalLiquidity)
        self.supplyIndex = self.supplyIndex * (1.0 + profitRate)
    
    if profitAccrued == decimalZero:
        self.totalLiquidity += decimalZero
    else: 
        self.totalLiquidity += profitAccrued
    self.fixedToPay -= max(fixedPaid, decimalZero)
    self.fixedToReceive -= max(fixedReceived, decimalZero)
    if self.lastFloatIndex == decimalZero:
        self.notionalPayingFloat = decimalZero
        self.notionalReceivingFloat = decimalZero
    else:
        self.notionalPayingFloat *= newFloatIndex / self.lastFloatIndex
        self.notionalReceivingFloat *= newFloatIndex / self.lastFloatIndex

@internal
def updateProtocolActiveCollateral():
    accruedDays: decimal = (convert(block.timestamp, decimal) - self.lastCheckpointTime) / secondsPerDay
    self.notionalDaysPayingFloat -= max(self.notionalReceivingFixed * accruedDays, decimalZero)
    self.notionalDaysReceivingFloat -= max(self.notionalPayingFixed * accruedDays, decimalZero)
    minFloatToReceive: decimal = (self.minPayoutRate * self.notionalDaysReceivingFloat) / daysInYear
    maxFloatToPay: decimal = (self.maxPayoutRate * self.notionalDaysPayingFloat) / daysInYear
    self.activeCollateral = self.fixedToPay + maxFloatToPay - self.fixedToReceive - minFloatToReceive

@internal
@view
def getFee() -> uint256:
    if self.totalLiquidity == decimalZero:
        return convert(self.feeBase * ETH_PRECISION, uint256)
    else:
        return convert((((self.activeCollateral * self.feeSensitivity)/self.totalLiquidity) + self.feeBase) * ETH_PRECISION, uint256)

@internal
def getRate(_swap_type: String[4], _order_notional: uint256) -> uint256:
    fee: decimal = convert(self.getFee(), decimal) / ETH_PRECISION
    notionalAmount: decimal = convert(_order_notional, decimal) / self.mantissa
    rateFactorDelta: decimal = decimalZero
    if self.totalLiquidity != decimalZero:
        rateFactorDelta = (notionalAmount * (self.rateFactorSensitivity * self.swapDuration)) / self.totalLiquidity
    if keccak256(_swap_type) == keccak256("pFix"):
        self.rateFactor += rateFactorDelta
    elif keccak256(_swap_type) == keccak256("rFix"):
        self.rateFactor -= rateFactorDelta
        fee = -fee 
    return convert(((self.rateRange * self.rateFactor / (sqrt((self.rateFactor * self.rateFactor) + self.slopeFactor))) + self.yOffset + fee) * ETH_PRECISION, uint256)

@external
def addLiquidity(_deposit_amount: uint256):
    assert self.isPaused == False
    self.accrueProtocolCashflow()
    self.lastCheckpointTime = convert(block.timestamp, decimal)
    depositDecimal: decimal = convert(_deposit_amount, decimal) / self.mantissa
    accruedAmount: decimal = decimalZero
    # assert self.tokenHandle.balanceOf(msg.sender) >= (convert(depositDecimal * self.mantissa, uint256))
    # self.tokenHandle.transferFrom(msg.sender, self, convert(depositDecimal * self.mantissa, uint256))
    if self.liquidityAccounts[msg.sender].depositSupplyIndex != decimalZero:
        accruedAmount = max(((self.liquidityAccounts[msg.sender].amount * self.supplyIndex) / self.liquidityAccounts[msg.sender].depositSupplyIndex), decimalZero)
    newAccountLiquidity: decimal = depositDecimal + accruedAmount
    self.liquidityAccounts[msg.sender].amount = newAccountLiquidity
    self.liquidityAccounts[msg.sender].lastDepositTime = convert(block.timestamp, decimal)
    self.liquidityAccounts[msg.sender].depositSupplyIndex = max(self.supplyIndex, decimalZero)
    self.totalLiquidity += depositDecimal
    self.lastFloatIndex = convert(self.getFloatIndex(), decimal) / ETH_PRECISION

@external
def removeLiquidity(_withdraw_amount:uint256):
    # assert convert(block.timestamp, decimal) - self.liquidityAccounts[msg.sender].lastDepositTime >= self.minDepositTime
    self.accrueProtocolCashflow()
    newAccountValue: decimal = decimalZero
    if self.liquidityAccounts[msg.sender].depositSupplyIndex != decimalZero:
        newAccountValue = ((self.liquidityAccounts[msg.sender].amount * self.supplyIndex) / self.liquidityAccounts[msg.sender].depositSupplyIndex)
    withdrawAmount: decimal = decimalZero
    if _withdraw_amount == MAX_UINT256:
        withdrawAmount = newAccountValue
    else:
        withdrawAmount = convert(_withdraw_amount,decimal) / self.mantissa
    self.updateProtocolActiveCollateral()
    self.lastCheckpointTime = convert(block.timestamp, decimal)
    assert withdrawAmount <= newAccountValue
    assert self.totalLiquidity > withdrawAmount
    assert (self.totalLiquidity - withdrawAmount) > self.activeCollateral
    # self.tokenHandle.transfer(msg.sender, convert(withdrawAmount * self.mantissa, uint256))
    self.liquidityAccounts[msg.sender].amount = newAccountValue - withdrawAmount
    self.liquidityAccounts[msg.sender].lastDepositTime = convert(block.timestamp, decimal)
    self.liquidityAccounts[msg.sender].depositSupplyIndex = max(self.supplyIndex,decimalZero)
    self.totalLiquidity -= withdrawAmount
    self.lastFloatIndex = convert(self.getFloatIndex(), decimal) / ETH_PRECISION

@external
def openPayFixedSwap(_notional_amount: uint256):
    assert self.isPaused == False
    self.accrueProtocolCashflow()
    self.updateProtocolActiveCollateral()
    timestampDecimal: decimal = convert(block.timestamp, decimal)
    self.lastCheckpointTime = timestampDecimal
    notionalAmount: decimal = convert(_notional_amount, decimal) / self.mantissa
    swapFixedRate: decimal = convert(self.getRate("pFix", _notional_amount), decimal) / ETH_PRECISION
    newMaxFloatToPay:decimal = (notionalAmount * self.maxPayoutRate * self.swapDuration) / daysInYear
    newFixedToReceive: decimal = (swapFixedRate * self.swapDuration * notionalAmount) / daysInYear
    assert self.activeCollateral + newMaxFloatToPay - newFixedToReceive < self.totalLiquidity
    self.avgFixedRateReceiving = (self.avgFixedRateReceiving * self.notionalReceivingFixed + notionalAmount * swapFixedRate) / (self.notionalReceivingFixed + notionalAmount)
    self.notionalReceivingFixed += notionalAmount
    self.notionalPayingFloat += notionalAmount
    self.fixedToReceive += newFixedToReceive
    self.notionalDaysPayingFloat += notionalAmount * self.swapDuration
    userCollateral:decimal = (notionalAmount * self.swapDuration * (swapFixedRate - self.minPayoutRate)) / daysInYear
    # assert self.tokenHandle.balanceOf(msg.sender) >= convert(userCollateral * self.mantissa, uint256)
    # self.tokenHandle.transferFrom(msg.sender, self, convert(userCollateral * self.mantissa, uint256))
    self.lastFloatIndex = convert(self.getFloatIndex(), decimal) / ETH_PRECISION

    swapKey: bytes32 = keccak256(concat(convert(msg.sender, bytes32), convert(self.swapNumbers[msg.sender], bytes32)))
    
    self.swaps[swapKey].swapType = "pFix"
    self.swaps[swapKey].notional = notionalAmount
    self.swaps[swapKey].initTime = timestampDecimal
    self.swaps[swapKey].swapRate = swapFixedRate
    self.swaps[swapKey].owner = msg.sender
    self.swaps[swapKey].initIndex = self.lastFloatIndex
    self.swaps[swapKey].userCollateral = userCollateral

    self.swapNumbers[msg.sender] += 1
    self.orderNumber += 1

@external
def openReceiveFixedSwap(_notional_amount: uint256):
    assert self.isPaused == False
    self.accrueProtocolCashflow()
    self.updateProtocolActiveCollateral()
    timestampDecimal: decimal = convert(block.timestamp, decimal)
    self.lastCheckpointTime = timestampDecimal
    notionalAmount: decimal = convert(_notional_amount, decimal) / self.mantissa
    swapFixedRate: decimal = convert(self.getRate("rFix", _notional_amount), decimal) / ETH_PRECISION
    newFixedToPay: decimal = (swapFixedRate * self.swapDuration * notionalAmount) / daysInYear
    newMinFloatAssetToReceive: decimal = (self.minPayoutRate * self.swapDuration * notionalAmount) / daysInYear
    assert self.activeCollateral + newFixedToPay - newMinFloatAssetToReceive < self.totalLiquidity
    self.avgFixedRatePaying = (self.avgFixedRatePaying * self.notionalPayingFixed + notionalAmount * swapFixedRate) / (self.notionalPayingFixed + notionalAmount)
    self.notionalPayingFixed += notionalAmount
    self.notionalReceivingFloat += notionalAmount
    self.fixedToPay += newFixedToPay
    self.notionalDaysReceivingFloat += notionalAmount * self.swapDuration
    userCollateral: decimal = (notionalAmount * self.swapDuration * (self.maxPayoutRate - swapFixedRate)) / daysInYear
    # assert self.tokenHandle.balanceOf(msg.sender) >= convert(userCollateral * self.mantissa, uint256)
    # self.tokenHandle.transferFrom(msg.sender, self, convert(userCollateral * self.mantissa, uint256))
    self.lastFloatIndex = convert(self.getFloatIndex(), decimal) / ETH_PRECISION

    swapKey: bytes32 = keccak256(concat(convert(msg.sender, bytes32), convert(self.swapNumbers[msg.sender], bytes32)))

    self.swaps[swapKey].swapType = "rFix"
    self.swaps[swapKey].notional = notionalAmount
    self.swaps[swapKey].initTime = timestampDecimal
    self.swaps[swapKey].swapRate = swapFixedRate
    self.swaps[swapKey].owner = msg.sender
    self.swaps[swapKey].initIndex = self.lastFloatIndex
    self.swaps[swapKey].userCollateral = userCollateral

    self.swapNumbers[msg.sender] += 1
    self.orderNumber = self.orderNumber + 1

@external
def closeSwap(_swap_key: bytes32):
    self.accrueProtocolCashflow()
    self.updateProtocolActiveCollateral()
    newFloatIndexUint: uint256 = self.getFloatIndex()
    newFloatIndex: decimal = convert(newFloatIndexUint, decimal) / ETH_PRECISION
    timestampDecimal: decimal = convert(block.timestamp, decimal)
    self.lastCheckpointTime = timestampDecimal
    swapLength: decimal = timestampDecimal - self.swaps[_swap_key].initTime
    assert swapLength / secondsPerDay >= self.swapDuration
    lateDays:decimal = (swapLength / secondsPerDay) - self.swapDuration
    if keccak256(self.swaps[_swap_key].swapType) == keccak256("pFix"):
        newNotionalReceiving:decimal = self.notionalReceivingFixed - self.swaps[_swap_key].notional
        if newNotionalReceiving == decimalZero:
            self.avgFixedRateReceiving = decimalZero
        else:
            self.avgFixedRateReceiving = ((self.avgFixedRateReceiving * self.notionalReceivingFixed - self.swaps[_swap_key].swapRate * self.swaps[_swap_key].notional) / newNotionalReceiving)
            self.avgFixedRateReceiving = max(self.avgFixedRateReceiving, decimalZero)
        self.notionalReceivingFixed -= self.swaps[_swap_key].notional
        self.notionalPayingFloat -= (self.swaps[_swap_key].notional * newFloatIndex) / self.swaps[_swap_key].initIndex
        self.fixedToReceive += (self.swaps[_swap_key].notional * self.swaps[_swap_key].swapRate * lateDays) / daysInYear
        self.notionalDaysPayingFloat += self.swaps[_swap_key].notional * lateDays
        self.notionalReceivingFixed = max(self.notionalReceivingFixed, decimalZero)
        self.notionalPayingFloat = max(self.notionalPayingFloat, decimalZero)
        self.fixedToReceive = max(self.fixedToReceive, decimalZero)
        self.notionalDaysPayingFloat = max(self.notionalDaysPayingFloat, decimalZero)

    if keccak256(self.swaps[_swap_key].swapType) == keccak256("rFix"):
        newNotionalPaying:decimal = self.notionalPayingFixed - self.swaps[_swap_key].notional
        if newNotionalPaying == decimalZero:
            self.avgFixedRatePaying = decimalZero
        else:
            self.avgFixedRatePaying = (self.avgFixedRatePaying * self.notionalPayingFixed - self.swaps[_swap_key].swapRate * self.swaps[_swap_key].notional) / newNotionalPaying
            self.avgFixedRatePaying = max(self.avgFixedRatePaying, decimalZero)
        self.notionalPayingFixed -= self.swaps[_swap_key].notional
        self.notionalReceivingFloat -= ((self.swaps[_swap_key].notional * newFloatIndex) / self.swaps[_swap_key].initIndex)
        self.fixedToPay += ((self.swaps[_swap_key].notional * self.swaps[_swap_key].swapRate * lateDays) / daysInYear)
        self.notionalDaysReceivingFloat += self.swaps[_swap_key].notional * lateDays
        self.notionalPayingFixed = max(self.notionalPayingFixed, decimalZero)
        self.notionalReceivingFloat = max(self.notionalReceivingFloat, decimalZero)
        self.fixedToPay = max(self.fixedToPay, decimalZero)
        self.notionalDaysReceivingFloat = max(self.notionalDaysReceivingFloat, decimalZero)
    fixedLeg:decimal = (self.swaps[_swap_key].notional * self.swaps[_swap_key].swapRate * swapLength) / daysInYear
    floatLeg:decimal = self.swaps[_swap_key].notional* (self.lastFloatIndex / self.swaps[_swap_key].initIndex - convert(1, decimal))
    if keccak256(self.swaps[_swap_key].swapType) == keccak256("pFix"):
        userProfit:decimal = floatLeg - fixedLeg
        # self.tokenHandle.transfer(self.swaps[_swap_key].owner, convert((userProfit + self.swaps[_swap_key].userCollateral) * self.mantissa,uint256))
    else:
        userProfit:decimal = fixedLeg - floatLeg
        # self.tokenHandle.transfer(self.swaps[_swap_key].owner, convert((userProfit + self.swaps[_swap_key].userCollateral) * self.mantissa,uint256))
    self.swaps[_swap_key].swapType = ""
    self.swaps[_swap_key].notional = decimalZero
    self.swaps[_swap_key].initTime = decimalZero
    self.swaps[_swap_key].swapRate = decimalZero
    self.swaps[_swap_key].owner = ZERO_ADDRESS
    self.swaps[_swap_key].initIndex = decimalZero
    self.swaps[_swap_key].userCollateral = decimalZero
    self.lastFloatIndex = convert(self.getFloatIndex(), decimal) / ETH_PRECISION

@external
@view
def getState() -> stateStruct:
    contractState: stateStruct = empty(stateStruct)
    contractState.admin = self.admin
    contractState.mantissa = convert(self.mantissa / CONTRACT_PRECISION, int128)
    contractState.yOffset = convert(self.yOffset / CONTRACT_PRECISION, int128)
    contractState.slopeFactor = convert(self.slopeFactor / CONTRACT_PRECISION, int128)
    contractState.rateFactorSensitivity = convert(self.rateFactorSensitivity / CONTRACT_PRECISION, int128)
    contractState.feeBase = convert(self.feeBase / CONTRACT_PRECISION, int128)
    contractState.feeSensitivity = convert(self.feeSensitivity / CONTRACT_PRECISION, int128)
    contractState.minPayoutRate = convert(self.minPayoutRate / CONTRACT_PRECISION, int128)
    contractState.maxPayoutRate = convert(self.maxPayoutRate / CONTRACT_PRECISION, int128)
    contractState.lastCheckpointTime = convert(self.lastCheckpointTime / CONTRACT_PRECISION, int128)
    contractState.avgFixedRateReceiving = convert(self.avgFixedRateReceiving / CONTRACT_PRECISION, int128)
    contractState.notionalReceivingFixed = convert(self.notionalReceivingFixed / CONTRACT_PRECISION, int128)
    contractState.avgFixedRatePaying = convert(self.avgFixedRatePaying / CONTRACT_PRECISION, int128)
    contractState.notionalPayingFixed = convert(self.notionalPayingFixed / CONTRACT_PRECISION, int128)
    contractState.notionalPayingFloat = convert(self.notionalPayingFloat / CONTRACT_PRECISION, int128)
    contractState.lastFloatIndex = convert(self.lastFloatIndex * ETH_PRECISION, int128)
    contractState.notionalReceivingFloat = convert(self.notionalReceivingFloat / CONTRACT_PRECISION, int128)
    contractState.totalLiquidity = convert(self.totalLiquidity / CONTRACT_PRECISION, int128)
    contractState.fixedToPay = convert(self.fixedToPay / CONTRACT_PRECISION, int128)
    contractState.fixedToReceive = convert(self.fixedToReceive / CONTRACT_PRECISION, int128)
    contractState.supplyIndex = convert(self.supplyIndex / CONTRACT_PRECISION, int128)
    contractState.notionalDaysPayingFloat = convert(self.notionalDaysPayingFloat / CONTRACT_PRECISION, int128)
    contractState.notionalDaysReceivingFloat = convert(self.notionalDaysReceivingFloat / CONTRACT_PRECISION, int128)
    contractState.activeCollateral = convert(self.activeCollateral / CONTRACT_PRECISION, int128)
    contractState.swapDuration = convert(self.swapDuration / CONTRACT_PRECISION, int128)
    contractState.rateFactor = convert(self.rateFactor / CONTRACT_PRECISION, int128)
    contractState.rateRange = convert(self.rateRange / CONTRACT_PRECISION, int128)
    contractState.orderNumber = convert(self.orderNumber, int128)
    return contractState

@external
@view
def getAccount(_liquidity_account: address) -> liquidityAccountReturnStruct:
    liquidityAccountReturn: liquidityAccountReturnStruct = empty(liquidityAccountReturnStruct)
    liquidityAccountReturn.amount = convert(self.liquidityAccounts[_liquidity_account].amount / CONTRACT_PRECISION, int128)
    liquidityAccountReturn.lastDepositTime = convert(self.liquidityAccounts[_liquidity_account].lastDepositTime / CONTRACT_PRECISION, int128)
    liquidityAccountReturn.depositSupplyIndex = convert(self.liquidityAccounts[_liquidity_account].depositSupplyIndex / CONTRACT_PRECISION, int128)
    return liquidityAccountReturn

@external
@view
def getSwap(_swap_key: bytes32) -> swapReturnStruct:
    swapReturn: swapReturnStruct = empty(swapReturnStruct)
    swapReturn.notional = convert(self.swaps[_swap_key].notional / CONTRACT_PRECISION, int128)
    swapReturn.initTime = convert(self.swaps[_swap_key].initTime / CONTRACT_PRECISION, int128) 
    swapReturn.swapRate = convert(self.swaps[_swap_key].swapRate / CONTRACT_PRECISION, int128)
    swapReturn.initIndex = convert(self.swaps[_swap_key].initIndex / CONTRACT_PRECISION, int128)
    swapReturn.userCollateral = convert(self.swaps[_swap_key].userCollateral / CONTRACT_PRECISION, int128)
    return swapReturn

@external
def getSwapType(_swap_key: bytes32) -> String[4]:
    return self.swaps[_swap_key].swapType