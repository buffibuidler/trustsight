import { Search2Icon } from "@chakra-ui/icons";
import { HStack, VStack, Text, Input, Image, Box } from "@chakra-ui/react";
import { categories, featuredProjects, featuredReviews } from "@data/data";
import styles from "@styles/Home.module.css";
import { abridgeAddress } from "@utils/abridgeAddress";
import { useState } from "react";

export default function Home() {
  const [selected, setSelected] = useState("DAO");
  const isNavbar = false;

  return (
    <main className={styles.main}>
      <Box h="40px" />
      <VStack gap={8}>
        <Text className={styles.title}>
          Read Reviews. Write Reviews. Find addresses you can{" "}
          <span className={styles.specialWord}>trust.</span>
        </Text>
        <HStack className={!isNavbar ? styles.searchbar : styles.searchbarMini}>
          <Search2Icon color="black" />
          <Input
            className={styles.searchInput}
            placeholder="Search by address or ENS"
          ></Input>
        </HStack>
      </VStack>
      <Box h="100px" />
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
        <HStack className={styles.carousel}>
          {featuredProjects.map(
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
        </HStack>
      </VStack>
      <Box h="60px" />
      <VStack gap={6} w="100%">
        <Text className={styles.header} w="100%">
          Recent Reviews
        </Text>
        <HStack className={styles.carousel}>
          {featuredReviews.map(
            ({ image, reviewer, recipient, stars, review }, idx) => (
              <VStack key={idx} className={styles.reviewCard}>
                <HStack>
                  <Image src={image} alt="yo" className={styles.reviewImage} />
                  {new Array(stars).fill(0).map((_, idx) => (
                    <Image
                      src="/star.png"
                      alt="yo"
                      key={idx}
                      className={styles.star}
                    />
                  ))}
                  {new Array(5 - stars).fill(0).map((_, idx) => (
                    <Image
                      src="/greystar.png"
                      alt="yo"
                      key={idx}
                      className={styles.star}
                    />
                  ))}
                </HStack>
                <Text className={styles.bold}>
                  {reviewer}{" "}
                  <span className={styles.specialWord2}>reviewed</span>{" "}
                  {recipient}
                </Text>
                <Text className={styles.review}>{review}</Text>
              </VStack>
            )
          )}
        </HStack>
      </VStack>
      <Box h="40px" />
      <Text className={styles.bold}>
        Built with ❤️ at ETHDenver #BUIDLathon
      </Text>
    </main>
  );
}
