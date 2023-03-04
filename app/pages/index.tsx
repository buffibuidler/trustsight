import { Search2Icon } from "@chakra-ui/icons";
import { HStack, VStack, Text, Input, Image } from "@chakra-ui/react";
import { featuredProjects, featuredReviews } from "@data/data";
import styles from "@styles/Home.module.css";
import { abridgeAddress } from "@utils/abridgeAddress";

export default function Home() {
  const isNavbar = false;

  return (
    <main className={styles.main}>
      <VStack>
        <Text className={styles.title}>
          Read Reviews. Write Reviews. Find addresses you can{" "}
          <span className={styles.specialWord}>trust.</span>
        </Text>
        <HStack className={!isNavbar ? styles.searchbar : styles.searchbarMini}>
          <Search2Icon color="black" />
          <Input className={styles.searchInput}></Input>
        </HStack>
      </VStack>
      <VStack>
        <Text>Explore Projects</Text>
        <HStack>
          <Text>DAO</Text>
          <Text>DeFi</Text>
          <Text>NFT</Text>
          <Text>Gaming</Text>
          <Text>Metaverse</Text>
          <Text>Social</Text>
          <Text>Security</Text>
          <Text>Infrastructure</Text>
          <Text>Wallet</Text>
          <Text>Identity</Text>
          <Text>ReFi</Text>
        </HStack>
        {featuredProjects.map(
          ({ title, image, score, address, reviews }, idx) => (
            <VStack key={idx}>
              <Image src={image} alt="yo" />
              <VStack>
                <HStack>
                  <Text>{title}</Text>
                  <Text>{score}</Text>
                </HStack>
                <HStack>
                  <Text>{abridgeAddress(address)}</Text>
                  <Text>{reviews}</Text>
                </HStack>
              </VStack>
            </VStack>
          )
        )}
      </VStack>
      <VStack>
        <Text>Recent Reviews</Text>
        {featuredReviews.map(
          ({ image, reviewer, recipient, stars, review }, idx) => (
            <VStack key={idx}>
              <HStack>
                <Image src={image} alt="yo" />
                {new Array(stars).fill(0).map((_, idx) => (
                  <Image src="/star.png" alt="yo" key={idx} />
                ))}
                {new Array(5 - stars).fill(0).map((_, idx) => (
                  <Image src="/greystar.png" alt="yo" key={idx} />
                ))}
              </HStack>
              <Text>{`${reviewer} reviewed ${recipient}`}</Text>
              <Text>{review}</Text>
            </VStack>
          )
        )}
      </VStack>
      <Text>Built with ❤️ at ETHDenver #BUIDLathon</Text>
    </main>
  );
}
