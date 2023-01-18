import { HStack, Text } from "@chakra-ui/react";
import React from "react";

function InstructionStep({ number, text }) {
  return (
    <HStack
      bg={"rgba(0,0,0,0.5)"}
      color={"white"}
      border={"1px solid white"}
      fontWeight={"normal"}
      borderRadius={"5px"}
      width={"50vw"}
      padding={"10px"}
      justify={"left"}
      align={"left"}
    >
      <Text>Step {number}</Text>
      {<Text>|</Text>}
      <Text>{text}</Text>
    </HStack>
  );
}

export default InstructionStep;
