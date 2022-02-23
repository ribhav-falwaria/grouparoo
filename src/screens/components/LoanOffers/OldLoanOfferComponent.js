import React, { useState, useContext } from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'
import {
  Button,
  Text,
  StyleService,
  useStyleSheet,
  Card
} from '@ui-kitten/components'
import { LoanOfferIcon, EditIcon, CheckIconGreen } from '../ThemedIcons'
import FormattedCardNoHeader from '../FormattedCardNoHeader'
import AmountRangeSelector from '../AmountRangeSelector'
import { LocalizationContext } from '../../../components/Translation'
import { config } from '../../../config'
import { rupeeFormatter, calculateEmi } from '../../../utils'
import { AmountDisplay, InterestDisplay } from '../ValueDisplayComponent'
import styleConstants from '../../styleConstants'
const LoanOfferComponent = ({
  onSubmit,
  loanOption
}) => {
  const [selectedTenure, setSelectedTenure] = useState(0)
  const [selectedRepayment, setSelectedRepayment] = useState(0)

  const [editLoanAmount, setEditLoanAmount] = useState(false)
  const [loanAmount, setLoanAmount] = useState(loanOption.maxLoanAmount)
  const { translations } = useContext(LocalizationContext)
  const styles = useStyleSheet(themedStyles)
  const loanEMI = calculateEmi(
    loanAmount,
    loanOption.tenures[selectedTenure],
    loanOption.repayments[selectedRepayment],
    loanOption.unit
  )
  const onSelectPress = () => {
    onSubmit({
      selectedOption: loanOption,
      configParams: {
        loanAmount,
        tenureIndex: selectedTenure,
        repaymentIndex: selectedRepayment
      }
    })
  }
  return (
    <View style={styles.container}>
      <FormattedCardNoHeader status='primary'>
        <View style={[styles.loanPropsContainer, styles.itemContainer]}>
          <View style={styles.withIconContainer}>
            <AmountDisplay
              label={translations['loan.loanAmount']}
              amount={loanAmount}
            />
            <View style={styles.iconContainer}>
              {!editLoanAmount && (
                <Button
                  accessoryLeft={EditIcon}
                  size='small'
                  appearance='ghost'
                  onPress={() => setEditLoanAmount(true)}
                />
              )}
              {editLoanAmount && (
                <Button
                  size='small'
                  appearance='ghost'
                  accessoryLeft={CheckIconGreen}
                  onPress={() => setEditLoanAmount(false)}
                />
              )}
            </View>
          </View>
          <InterestDisplay
            label={translations['loan.interestRate']}
            interestRate={loanOption.estimatedInterestRate}
          />
        </View>
        {editLoanAmount && (
          <View style={styles.itemContainer}>
            <AmountRangeSelector
              value={loanOption.maxLoanAmount}
              step={config.TERM_LOAN_AMOUNT_STEP}
              minimumValue={config.TERM_LOAN_MIN_AMOUNT}
              maximumValue={loanOption.maxLoanAmount}
              onChange={setLoanAmount}
            />
          </View>
        )}
        <View style={styles.itemContainer}>
          <Text category='label'>
            {translations['application.loanPeriod']}
          </Text>
          <View style={styles.tenureContainer}>
            {
              loanOption.tenures.map((tenure, ix) => (
                <Button
                  size='small'
                  appearance={selectedTenure === ix ? 'outline' : 'ghost'}
                  style={styles.buttonStyle}
                  key={`tenures-${ix}`}
                  status={selectedTenure === ix ? 'primary' : 'basic'}
                  onPress={() => setSelectedTenure(ix)}
                >
                  {`${tenure} ${loanOption.unitDisplay}`}
                </Button>
              ))
            }
          </View>
        </View>
        <View style={styles.itemContainer}>
          <Text category='label'>
            {translations['application.repayment']}
          </Text>
          <View style={styles.tenureContainer}>
            {
              loanOption.repayments.map((rp, ix) => (
                <Button
                  size='small'
                  appearance={selectedRepayment === ix ? 'outline' : 'ghost'}
                  style={styles.buttonStyle}
                  key={`tenures-${ix}`}
                  status={selectedRepayment === ix ? 'primary' : 'basic'}
                  onPress={() => setSelectedRepayment(ix)}
                >
                  {translations[`period.${rp}ly`]}
                </Button>
              ))
            }
          </View>
        </View>
        <View style={styles.itemContainer}>
          <Card style={styles.loanEmiContainer}>
            <Text category='h6'>
              <Text category='label'>
                {'₹ '}
              </Text>
              {rupeeFormatter(loanEMI)}
            </Text>
            <Text catgory='p'>
              {translations[`period.inst.per.${loanOption.unit}`]}
            </Text>
          </Card>
        </View>
        <Button
          status='primary'
          onPress={onSelectPress}
        >
          {translations['application.acceptOffer']}
        </Button>
      </FormattedCardNoHeader>
    </View>
  )
}
const themedStyles = StyleService.create({
  iconContainer: {
    alignSelf: 'flex-end',
    marginLeft: 8,
    marginTop: 4
  },
  withIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  itemContainer: {
    marginVertical: 8
  },
  container: {
    ...styleConstants.container,
    marginTop: 16
  },
  loanPropsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16
  },
  loanEmiContainer: {
    height: heightPercentageToDP('10%'),
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'background-basic-color-2',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8
  },
  tenureContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
    paddingHorizontal: 4
  },
  buttonStyle: {
    marginLeft: 0
  },
  loanAmountContainer: {
    alignItems: 'center'
  }
})
export default LoanOfferComponent
