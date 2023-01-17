import { HStack, Text } from "@chakra-ui/react";
import React from "react";

function BalanceItem({ label, amount }) {
  return (
    <HStack
      bg={"black"}
      border={"1px solid white"}
      borderRadius={"10px"}
      minW={"130px"}
      padding={"10px"}
      justify={"space-evenly"}
    >
      <Text>{label}</Text>
      <Text>|</Text>
      <Text>{amount}</Text>
    </HStack>
  );
}

export default BalanceItem;
