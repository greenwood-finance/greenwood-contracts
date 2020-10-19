# (c) 2020 Greenwood
# @title Greenwood Model
# @author Brandon McFarland
# @notice An interest rate model storage contract for the Greenwood protocol

struct modelStruct:
    yOffset: int128
    slopeFactor:int128
    rateFactorSensitivity: int128
    feeBase: int128
    feeSensitivity: int128
    rateRange: int128
    utilizationInflection: int128
    utilizationMultiplier: int128
    minPayoutRate: int128
    maxPayoutRate:int128
    isPaused: bool
    closeSwapOverride: bool

admin: address
yOffset: int128
slopeFactor: int128
rateFactorSensitivity: int128
feeBase: int128
feeSensitivity: int128
rateRange: int128
utilizationInflection: int128
utilizationMultiplier: int128
minPayoutRate: int128
maxPayoutRate: int128
isPaused: bool
closeSwapOverride:bool

@external
def __init__(_admin_addr:address, _y_offset: int128, _slope_factor:int128, _rate_factor_sensitivity: int128, _fee_base: int128, _fee_sensitivity: int128, _range: int128, _utilization_inflection: int128, _utilization_multiplier: int128, _min_payout_rate: int128, _max_payout_rate:int128, _is_paused: bool, _close_swap_override: bool):
    self.admin = _admin_addr
    self.yOffset = _y_offset
    self.slopeFactor = _slope_factor
    self.rateFactorSensitivity = _rate_factor_sensitivity
    self.feeBase = _fee_base
    self.feeSensitivity = _fee_sensitivity
    self.rateRange = _range
    self.utilizationInflection = _utilization_inflection
    self.utilizationMultiplier = _utilization_multiplier
    self.minPayoutRate = _min_payout_rate
    self.maxPayoutRate = _max_payout_rate
    self.isPaused = _is_paused
    self.closeSwapOverride = _close_swap_override

@external
@view
def getModel() -> modelStruct:
    currentModel: modelStruct = empty(modelStruct)
    currentModel.yOffset = self.yOffset
    currentModel.slopeFactor = self.slopeFactor
    currentModel.rateFactorSensitivity = self.rateFactorSensitivity
    currentModel.feeBase = self.feeBase
    currentModel.feeSensitivity = self.feeSensitivity
    currentModel.rateRange = self.rateRange
    currentModel.utilizationInflection = self.utilizationInflection
    currentModel.utilizationMultiplier = self.utilizationMultiplier
    currentModel.minPayoutRate = self.minPayoutRate
    currentModel.maxPayoutRate = self.maxPayoutRate
    currentModel.isPaused = self.isPaused
    currentModel.closeSwapOverride = self.closeSwapOverride

    return currentModel

@external
def setModel( _y_offset: int128, _slope_factor:int128, _rate_factor_sensitivity: int128, _fee_base: int128, _fee_sensitivity: int128, _range: int128, _utilization_inflection: int128, _utilization_multiplier: int128, _min_payout_rate: int128, _max_payout_rate:int128, _is_paused: bool, _close_swap_override: bool):
    assert msg.sender == self.admin
    self.yOffset = _y_offset
    self.slopeFactor = _slope_factor
    self.rateFactorSensitivity = _rate_factor_sensitivity
    self.feeBase = _fee_base
    self.feeSensitivity = _fee_sensitivity
    self.rateRange = _range
    self.utilizationInflection = _utilization_inflection
    self.utilizationMultiplier = _utilization_multiplier
    self.minPayoutRate = _min_payout_rate
    self.maxPayoutRate = _max_payout_rate
    self.isPaused = _is_paused
    self.closeSwapOverride = _close_swap_override