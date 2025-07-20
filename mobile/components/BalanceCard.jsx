import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export const BalanceCard = ({ summary }) => {
  return (
    <LinearGradient
      colors={COLORS.gradient.card}
      style={styles.balanceCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={[styles.balanceTitle, { fontSize: 16, fontWeight: "600", marginBottom: 12 }]}>
        Total Balance
      </Text>
      <Text style={[styles.balanceAmount, { fontSize: 36, fontWeight: "800", letterSpacing: 1, marginBottom: 24 }]}>
        ₹{parseFloat(summary.balance).toFixed(2)}
      </Text>
      <View style={[styles.balanceStats, { paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border }]}>
        <View style={styles.balanceStatItem}>
          <Text style={[styles.balanceStatLabel, { fontSize: 15, fontWeight: "500", marginBottom: 8 }]}>Income</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.income, fontSize: 18, fontWeight: "700" }]}>
            +₹{parseFloat(summary.income).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.balanceStatItem, styles.statDivider]} />
        <View style={styles.balanceStatItem}>
          <Text style={[styles.balanceStatLabel, { fontSize: 15, fontWeight: "500", marginBottom: 8 }]}>Expenses</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.expense, fontSize: 18, fontWeight: "700" }]}>
            -₹{Math.abs(parseFloat(summary.expenses)).toFixed(2)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};