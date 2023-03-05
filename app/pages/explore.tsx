import { HStack, VStack, Text, Image, Box, SimpleGrid } from "@chakra-ui/react";
import withTransition from "@components/withTransition";
import { categories, defiProjects } from "@data/data";
import styles from "@styles/Home.module.css";
import { abridgeAddress } from "@utils/utils";
import { useState } from "react";

function Home() {
  const [selected, setSelected] = useState("DeFi");
  const isNavbar = false;

  return (
    <main className={styles.main}>
      <VStack gap={4} w="100%">
        <Text className={styles.header} w="100%">
          Explore Projects
        </Text>
        <HStack w="100%" justifyContent="space-between">
          {categories.map((value, idx) => (
            <Text
              key={idx}
              className={`${styles.subheader} ${
                selected === value && styles.selected
              }`}
              onClick={() => setSelected(value)}
              cursor="pointer"
            >
              {value}
            </Text>
          ))}
        </HStack>
        <Box h="10px" />
        <SimpleGrid columns={4} gap={10}>
          {defiProjects.map(
            ({ title, image, score, address, reviews }, idx) => (
              <VStack key={idx} className={styles.projectCard}>
                <Image src={image} alt="yo" className={styles.projectImage} />
                <VStack w="100%" pt=".3rem">
                  <HStack className={styles.projectTextContainer}>
                    <Text className={styles.projectTitle}>{title}</Text>
                    <HStack>
                      <Image
                        src="/blackstar.png"
                        alt="yo"
                        className={styles.blackstar}
                      />
                      <Text className={styles.projectTitle}>{score}</Text>
                    </HStack>
                  </HStack>
                  <HStack className={styles.projectTextContainer}>
                    <Text className={styles.projectSubtitle}>
                      {abridgeAddress(address)}
                    </Text>
                    <Text className={styles.projectSubtitle}>({reviews})</Text>
                  </HStack>
                </VStack>
              </VStack>
            )
          )}
        </SimpleGrid>
      </VStack>
      <Box h="40px" />
      <Text className={styles.bold}>
        Built with ❤️ at ETHDenver #BUIDLathon
      </Text>
    </main>
  );
}

export default withTransition(Home);
