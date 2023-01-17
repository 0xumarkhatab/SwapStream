import { Box, Flex, Link, Center } from "@chakra-ui/react";
import NavbarLink from "./NavbarLink";
const Navbar = () => (
  <Center
    position={"absolute"}
    top={"2vh"}
    left={["2vw", "5vw", "5vw", "30vw"]}
    right={["2vw", "5vw", "5vw", "30vw"]}
  >
    <Box
      border="1px solid white"
      borderRadius="20px"
      bg="black"
      px={4}
      py={2}
      my={4}
    >
      <Flex
        align="center"
        justify="space-around"
        width={["100vw", "80vw", "80vw", "40vw"]}
      >
        <Link href="/" fontSize="xl" fontWeight="bold" color={"white"}>
          SwapStream
        </Link>
        <NavbarLink title={"learn"} link={"#"} />
        <NavbarLink title={"profit"} link={"#"} />
        <NavbarLink title={"about us"} link={"#"} />
      </Flex>
    </Box>
  </Center>
);
export default Navbar;
