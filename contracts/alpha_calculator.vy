# (c) 2020 Greenwood
# @title Greenwood Calculator
# @author Brandon McFarland
# @notice An external calculation contract for the Greenwood protocol

interface COMPOUND:
    def borrowRatePerBlock() -> uint256: view

BLOCKS_PER_DAY: constant(decimal) = 5760.0
ETH_PRECISION: constant(decimal) = 1000000000000000000.0
CONTRACT_PRECISION: constant(decimal) = 0.0000000001
DECIMAL_ZERO: constant(decimal) = 0.0

compoundHandle: COMPOUND

@external
def __init__(_compound_addr:address):
    self.compoundHandle = COMPOUND(_compound_addr)

@external
@view
def getFloatIndex() -> uint256:
    rate: decimal = convert(self.compoundHandle.borrowRatePerBlock(), decimal)
    t0: decimal = rate / ETH_PRECISION * BLOCKS_PER_DAY + 1.0
    t1: decimal = t0 * t0
    for i in range(362):
        t1 = t1 * t0
    t2: decimal = t1 - convert(1, decimal)
    t3: decimal = t2 * convert(100,decimal)
    return convert(t3 * ETH_PRECISION, uint256)

@external
@view
def getFee(_total_liquidity: int128, _fee_base: int128, _active_collateral: int128, _utilization_inflection: int128, _fee_sensitivity: int128, _utilization_multiplier: int128) -> uint256:
    totalLiquidity: decimal = convert(_total_liquidity, decimal) * CONTRACT_PRECISION
    feeBase: decimal = convert(_fee_base,decimal) * CONTRACT_PRECISION
    activeCollateral: decimal = convert(_active_collateral,decimal) * CONTRACT_PRECISION
    utilizationInflection: decimal = convert(_utilization_inflection,decimal) * CONTRACT_PRECISION
    feeSensitivity: decimal = convert(_fee_sensitivity, decimal) * CONTRACT_PRECISION
    utilizationMultiplier: decimal = convert(_utilization_multiplier, decimal) * CONTRACT_PRECISION

    if totalLiquidity == DECIMAL_ZERO:
        return convert(feeBase * ETH_PRECISION, uint256)
    else:
        utilization: decimal = activeCollateral / totalLiquidity
        if utilization > utilizationInflection:
            feeMultiplier: decimal = feeSensitivity * utilizationMultiplier
            return convert(((utilization * feeSensitivity + feeBase) + ((utilization - utilizationInflection) * feeMultiplier)) / CONTRACT_PRECISION, uint256)

        else:
            return convert((utilization * feeSensitivity + feeBase) / CONTRACT_PRECISION, uint256)