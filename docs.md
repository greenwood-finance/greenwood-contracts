# Greenwood Core

This document outlines the contract methods made available by the Greenwood automated interest rate swap protocol.

## Contract Methods

### Constructor

```python
def __init__( _token_addr: address, _compound_addr: address, _mantissa: uint256):
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _token_addr | address | The address of the underlying token | 
| _compound_addr | address | The address of the Compound cToken | 
| _mantissa | uint256 | The precision of the underlying token | 

### getFee
A fee scheme based on utilization %. We charge a higher fee when there is more utilization, because it means liquidity providers may not be able to withdraw.
```python
@internal
@view
def getFee() -> uint256
```

**Arguments**
| None        |
| ------------- |

**Truffle Console Example**
```js
let instance = await greenwood.deployed()
let accounts = await web3.eth.getAccounts()
await instance.getFee().then( function ( result ) { console.log( result.toString() ); } )
```
### getRate

```python
@internal
def getRate(_swap_type: String[4], _order_notional: uint256) -> uint256
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _swap_type | String[4] | The position of the swap | 
| _order_notional | uint256 | The notional amount of the swap | 

### accrueProtocolCashflow

```python
@internal
def accrueProtocolCashflow()
```

**Arguments**
| None        |
| ------------- |

### updateProtocolActiveCollateral

```python
@internal
def updateProtocolActiveCollateral()
```

**Arguments**
| None        |
| ------------- |

### updateModel

```python
@external
def updateModel(_y_offset: uint256, _slope_factor: uint256, _rate_factor_sensitivity: uint256, _fee_base: uint256, _fee_sensitivity: uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _y_offset | uint256 | Determines the asymptotes of the protocol offered rate | 
| _slope_factor | uint256 | Determines how strongly the protocol reacts to market conditions | 
| _rate_factor_sensitivity | uint256 | Used to calculate the `rateFactorDelta` | 
| _fee_base | uint256 | The base fee charged by the protocol | 
| _fee_sensitivity | uint256 | Used to calculate thefee charged by the protocol | 

### updateCollateralRequirements

```python
@external
def  updateCollateralRequirements(_min_payout_rate: uint256, _max_payout_rate: uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _min_payout_rate | uint256 | The minimum floating rate that the protocol will accept from a trader paying floating | 
| _max_payout_rate | uint256 | The maximum floating rate that the protocol will pay out |

### addLiquidity

```python
@external
def addLiquidity(_deposit_amount: uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _deposit_amount | uint256 | The amount of tokens being added multiplied by the precision of the underlying token | 

### removeLiquidity

```python
@external
def removeLiquidity(_withdraw_amount: uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _withdraw_amount | uint256 | The amount of tokens being removed multiplied by the precision of the underlying token | 

### openPayFixedSwap

```python
@external
def  openPayFixedSwap(_notional_amount: uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _notional_amount | uint256 | The notional value of the swap being opened | 

### openReceiveFixedSwap

```python
@external
def openReceiveFixedSwap(_notional_amount: uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _notional_amount | uint256 | The notional value of the swap being opened | 

### closeSwap

```python
@external
def closeSwap(_order_number: uint256)
```

**Arguments**

| Name        | Type           | Description  |
| ------------- |------------- | -----|
| _order_number | uint256 | THe order number of the swap to be closed | 
