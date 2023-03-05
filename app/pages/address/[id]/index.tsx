import styles from "@styles/Home.module.css";
import { HStack, Image, VStack, Text, Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { mockAddresses, mockReviews } from "@data/data";
import { abridgeAddress, capitalizeFirstLetter } from "@utils/utils";
import { Select } from "@chakra-ui/react";

function Profile() {
  const router = useRouter();
  const { id: address } = router.query;

  const account = mockAddresses[address as string];
  const reviewList = mockReviews[address as string];

  if (!account) return null;

  const {
    title,
    image,
    category,
    score,
    reviews,
    description,
    createdAt,
    subscores,
  } = account;

  return (
    <main className={styles.main}>
      <HStack>
        <VStack className={styles.leftSection}>
          <VStack className={styles.stickySection}>
            <Image
              src={image}
              alt={image}
              className={styles.profileImage}
            ></Image>
            <Box h="10px"></Box>
            <HStack>
              {new Array(5).fill(0).map((_, idx) => (
                <Image
                  src="/blankstar.png"
                  alt="yo"
                  key={idx}
                  className={styles.largestar}
                />
              ))}
            </HStack>
            <Text>Review this address</Text>
          </VStack>
        </VStack>
        <VStack>
          <VStack className={styles.rightSection}>
            <Text className={styles.profileTitle}>{title}</Text>
            <HStack>
              <Text className={styles.profileSubtitle}>
                {abridgeAddress(address as string)}
              </Text>
              <VStack className={styles.categoryPill}>
                <Text className={styles.categoryPillText}>{category}</Text>
              </VStack>
            </HStack>

            <HStack>
              {new Array(Math.round(score)).fill(0).map((_, idx) => (
                <Image
                  src="/star.png"
                  alt="yo"
                  key={idx}
                  className={styles.largestar}
                />
              ))}
              {new Array(5 - Math.round(score)).fill(0).map((_, idx) => (
                <Image
                  src="/greystar.png"
                  alt="yo"
                  key={idx}
                  className={styles.largestar}
                />
              ))}
              <Text className={styles.scoreText}>{score}</Text>
              <Text className={styles.reviewsText}>· {reviews} reviews</Text>
            </HStack>
            <Box h="1px"></Box>
            <Text className={styles.description}>{description}</Text>
            <Box h="10px"></Box>
            <Text className={styles.reviewsText}>
              Contract deployed on {new Date(createdAt).toDateString()}
            </Text>
          </VStack>
          <Box h="20px"></Box>
          <VStack className={styles.reviewsContainer}>
            <Text className={styles.reviewsHeader}>Reviews</Text>
            <VStack className={styles.reviewsScorebarContainer}>
              {subscores.map((val) => (
                <HStack key={val}>
                  <Text className={styles.categoryTitle}>
                    {capitalizeFirstLetter(val)}
                  </Text>
                  <Box className={styles.scoreBarContainer}>
                    <Box className={styles.scoreBar}></Box>
                  </Box>
                  <Text className={styles.categoryScore}>{account[val]}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
          <Box h="20px"></Box>
          <VStack gap={5}>
            <HStack className={styles.filterContainer}>
              <Text className={styles.filterLabel}>Sort by:</Text>
              <VStack className={styles.select}>
                <Select variant="custom">
                  <option value="option1">Most recent</option>
                  <option value="option2">Most trusted</option>
                </Select>
              </VStack>
              <Box w="10px"></Box>
              <Text className={styles.filterLabel}>Filter by:</Text>
              <VStack className={styles.select}>
                <Select variant="custom">
                  <option value="option1">5 stars</option>
                  <option value="option1">4 stars</option>
                  <option value="option1">3 stars</option>
                  <option value="option1">2 stars</option>
                  <option value="option1">1 stars</option>
                </Select>
              </VStack>
            </HStack>

            {reviewList.map(
              ({ reviewer, image, score, stars, review, createdAt }, idx) => (
                <HStack key={idx} className={styles.reviewContainer}>
                  <VStack className={styles.leftReviewSection}>
                    <Image
                      alt={reviewer}
                      src={image}
                      className={styles.reviewImage}
                    />
                    <Text className={styles.reviewReviewer}>{reviewer}</Text>
                    <HStack>
                      <Image
                        alt="yo"
                        src="/blackstar.png"
                        className={styles.blackstar}
                        opacity={0.5}
                      ></Image>
                      <Text className={styles.reviewScore}>{score}</Text>
                    </HStack>
                  </VStack>
                  <VStack className={styles.rightReviewSection}>
                    <HStack className={styles.rightTopSection}>
                      <HStack>
                        {new Array(stars).fill(0).map((_, idx) => (
                          <Image
                            src="/star.png"
                            alt="yo"
                            key={idx}
                            className={styles.star}
                          />
                        ))}
                      </HStack>
                      <Text className={styles.reviewDate}>
                        {new Date(createdAt).toDateString()}
                      </Text>
                    </HStack>
                    <Text className={styles.reviewDescription}>{review}</Text>
                  </VStack>
                </HStack>
              )
            )}
          </VStack>
        </VStack>
      </HStack>
    </main>
  );
}

export default Profile;
