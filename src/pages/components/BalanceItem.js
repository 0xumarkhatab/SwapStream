import { color, HStack, Text } from "@chakra-ui/react";
import React from "react";

function BalanceItem({ label, amount, isPlain, bg, color, weight }) {
  return (
    <HStack
      bg={bg ? bg : "black"}
      color={color ? color : "white"}
      border={"1px solid white"}
      fontWeight={weight ? weight : "normal"}
      borderRadius={"10px"}
      minW={"140px"}
      padding={"10px"}
      justify={"space-evenly"}
    >
      <Text>{label}</Text>
      {!isPlain && <Text>|</Text>}
      {amount != undefined && <Text>{parseFloat(amount).toFixed(2)}</Text>}
    </HStack>
  );
}

export default BalanceItem;
