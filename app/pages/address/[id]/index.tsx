import styles from "@styles/Home.module.css";
import {
  HStack,
  Image,
  VStack,
  Text,
  Box,
  useDisclosure,
  Button,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { mockAddresses, mockReviews } from "@data/data";
import { abridgeAddress, capitalizeFirstLetter } from "@utils/utils";
import { Select } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { FaFlag } from "react-icons/fa";
import Identicon from "react-identicons";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

function Profile() {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    flags,
  } = account;

  return (
    <main className={styles.main}>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent className={styles.modalContent}>
          <ModalHeader className={styles.modalHeader}>
            <Text className={styles.yourReview}>Your Review</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <HStack className={styles.modalTopSection}>
                <HStack>
                  <Image
                    src={image}
                    alt={image}
                    className={styles.modalImage}
                  ></Image>
                  <VStack className={styles.modalTitleSection}>
                    <Text className={styles.modalTitle}>{title}</Text>
                    <Text className={styles.modalAddress}>
                      {abridgeAddress(address as string)}
                    </Text>
                  </VStack>
                </HStack>
                <HStack gap={2}>
                  <Text className={styles.trustScore}>Trust Score</Text>
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
                </HStack>
              </HStack>
              <Box h="10px"></Box>
              <HStack>
                {category && (
                  <VStack className={styles.categoryPill}>
                    <Text className={styles.categoryPillText}>{category}</Text>
                  </VStack>
                )}
                <Text className={styles.subHeader}>
                  Category scores (optional)
                </Text>
              </HStack>
              <Box h="10px"></Box>
              {subscores && subscores.length > 0 && (
                <SimpleGrid columns={2} gap={6}>
                  {subscores.map((val) => (
                    <HStack key={val}>
                      <Text className={styles.subHeader} w="130px">
                        {capitalizeFirstLetter(val)}
                      </Text>
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
                    </HStack>
                  ))}
                </SimpleGrid>
              )}
              <Box h="15px"></Box>
              <VStack w="100%" alignItems="flex-start">
                <Text className={styles.trustScore}>Comments</Text>
                <Box h="5px"></Box>
                <Textarea placeholder="Write your review" />
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter className={styles.modalFooter}>
            <Button className={styles.submitButton}>Submit review</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <HStack w="100%" justifyContent="space-between">
        <VStack className={styles.leftSection}>
          <VStack className={styles.stickySection}>
            {image ? (
              <Image
                src={image}
                alt={image}
                className={styles.profileImage}
              ></Image>
            ) : (
              <Identicon
                string={address as string}
                className={styles.profileImage}
              />
            )}
            <Box h="10px"></Box>
            <VStack>
              <HStack onClick={onOpen}>
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
        </VStack>

        <VStack className={styles.rightSection}>
          <VStack className={styles.rightInnerSection}>
            <HStack w="100%" justifyContent="space-between">
              <Text className={styles.profileTitle}>
                {title ? title : abridgeAddress(address as string)}
              </Text>
              <HStack>
                <VStack>
                  <HStack>
                    <VStack opacity={0.4}>
                      <FaFlag />
                    </VStack>
                    <Text className={styles.reviewsText}>
                      Report this address
                    </Text>
                  </HStack>
                  <Text className={styles.reviewsSubtext}>
                    Reported by {flags} users
                  </Text>
                </VStack>
              </HStack>
            </HStack>
            <HStack>
              <Text className={styles.profileSubtitle}>
                {abridgeAddress(address as string)}
              </Text>
              {category && (
                <VStack className={styles.categoryPill}>
                  <Text className={styles.categoryPillText}>{category}</Text>
                </VStack>
              )}
              {flags && (
                <VStack className={styles.scamPill}>
                  <Text className={styles.categoryPillText}>Likely Scam</Text>
                </VStack>
              )}
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
            <Text className={styles.description}>
              {description ?? "No description available."}
            </Text>
            <Box h="10px"></Box>
            {createdAt && (
              <Text className={styles.reviewsText}>
                Contract deployed on {new Date(createdAt).toDateString()}
              </Text>
            )}
          </VStack>
          <Box h="20px"></Box>
          <VStack className={styles.reviewsContainer}>
            <Text className={styles.reviewsHeader}>Reviews</Text>
            <VStack className={styles.reviewsScorebarContainer}>
              {subscores &&
                subscores.length > 0 &&
                subscores.map((val) => (
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
          {subscores && <Box h="20px"></Box>}
          <VStack w="100%" gap={5} alignItems="flex-start">
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
            <Tabs isFitted variant="custom">
              <TabList mb="1em">
                <Tab
                  _selected={{
                    color: "black",
                    fontWeight: 700,
                    borderBottom: "2px solid black",
                  }}
                >
                  Received
                </Tab>
                <Tab
                  _selected={{
                    color: "black",
                    fontWeight: 700,
                    borderBottom: "2px solid black",
                  }}
                >
                  Given
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack gap={5}>
                    {reviewList ? (
                      reviewList.map(
                        (
                          { reviewer, image, score, stars, review, createdAt },
                          idx
                        ) => (
                          <HStack key={idx} className={styles.reviewContainer}>
                            <VStack className={styles.leftReviewSection}>
                              <Image
                                alt={reviewer}
                                src={image}
                                className={styles.reviewImage}
                              />
                              <Text className={styles.reviewReviewer}>
                                {reviewer}
                              </Text>
                              <HStack>
                                <Image
                                  alt="yo"
                                  src="/blackstar.png"
                                  className={styles.blackstar}
                                  opacity={0.5}
                                ></Image>
                                <Text className={styles.reviewScore}>
                                  {score}
                                </Text>
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
                                  {new Array(5 - stars)
                                    .fill(0)
                                    .map((_, idx) => (
                                      <Image
                                        src="/greystar.png"
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
                              <Text className={styles.reviewDescription}>
                                {review}
                              </Text>
                            </VStack>
                          </HStack>
                        )
                      )
                    ) : (
                      <Text>No reviews available.</Text>
                    )}
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <VStack gap={5}>
                    {reviewList ? (
                      reviewList.map(
                        (
                          { reviewer, image, score, stars, review, createdAt },
                          idx
                        ) => (
                          <HStack key={idx} className={styles.reviewContainer}>
                            <VStack className={styles.leftReviewSection}>
                              <Image
                                alt={reviewer}
                                src={image}
                                className={styles.reviewImage}
                              />
                              <Text className={styles.reviewReviewer}>
                                {reviewer}
                              </Text>
                              <HStack>
                                <Image
                                  alt="yo"
                                  src="/blackstar.png"
                                  className={styles.blackstar}
                                  opacity={0.5}
                                ></Image>
                                <Text className={styles.reviewScore}>
                                  {score}
                                </Text>
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
                                  {new Array(5 - stars)
                                    .fill(0)
                                    .map((_, idx) => (
                                      <Image
                                        src="/greystar.png"
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
                              <Text className={styles.reviewDescription}>
                                {review}
                              </Text>
                            </VStack>
                          </HStack>
                        )
                      )
                    ) : (
                      <Text>No reviews available.</Text>
                    )}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </VStack>
      </HStack>
    </main>
  );
}

export default Profile;
