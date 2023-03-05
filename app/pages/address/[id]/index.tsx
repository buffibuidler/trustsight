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
  Spinner,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useWeb3Modal } from "@web3modal/react";

import { useRouter } from "next/router";
import { mockAddresses, mockReviews } from "@data/data";
import {
  abridgeAddress,
  capitalizeFirstLetter,
  encodeRawKey,
} from "@utils/utils";
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
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
} from "wagmi";
import { useState } from "react";
import abi from "@data/abi.json";
import { useEffect } from "react";
import SuccessLottie from "@components/SuccessLottie";
import withTransition from "@components/withTransition";
import { useBalance } from "wagmi";

const TRUSTSIGHT_ADDRESS = "0x15AE58Fd3570e74EBe89fDBc897d31f9a6945377";
const ATTESTATION_STATION = "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77";

function Profile() {
  const provider = useProvider();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [scoreMap, setScoreMap] = useState({ trust: 0 });
  const [eventLogMap, setEventLogMap] = useState({});
  const [trustScoresMap, setTrustScoresMap] = useState({});
  const [attestationMap, setAttestationMap] = useState({ trust: { val: 0 } });
  const [five, setFive] = useState(false);
  const {
    address: connectedAddress,
    isConnecting,
    isDisconnected,
  } = useAccount();
  const { isOpen: isModalOpen, open, close, setDefaultChain } = useWeb3Modal();

  const router = useRouter();
  const { id: address } = router.query;

  let account = mockAddresses[address as string];
  const reviewList = mockReviews[address as string];

  function handleSetFive() {
    setFive(true);
  }
  const { data: balance } = useBalance({
    address: connectedAddress,
  });

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: ATTESTATION_STATION,
    abi,
    functionName: "attest",
    args: [Object.values(attestationMap)],
  });

  const { data, error, isError, isLoading, isSuccess, write } =
    useContractWrite(config);

  async function fetchTrustSightScores() {
    if ("trustsight.trust" in eventLogMap) return;

    const tempProvider = new ethers.providers.AlchemyProvider(
      "optimism-goerli",
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
    );

    const attestationStation = new ethers.Contract(
      ATTESTATION_STATION,
      abi,
      tempProvider
    );
    const eventKey = attestationStation.filters.AttestationCreated(
      TRUSTSIGHT_ADDRESS,
      address
    );
    const events = await attestationStation.queryFilter(eventKey, 3451375);

    const fetchedEventMap = {};

    events.forEach(({ args }) => {
      const encodedKey = args[2];
      const encodedValue = args[3];
      const decodedKey = ethers.utils
        .toUtf8String(encodedKey)
        .split("\u0000")[0];
      const decodedValue = Number(encodedValue);
      fetchedEventMap[decodedKey] = decodedValue;
    });

    setEventLogMap(fetchedEventMap);
    console.log("fetchedEventMap: ", fetchedEventMap);
  }

  async function fetchAllTrustScores() {
    if ("trustsight.trust" in trustScoresMap) return;

    const tempProvider = new ethers.providers.AlchemyProvider(
      "optimism-goerli",
      process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
    );

    const attestationStation = new ethers.Contract(
      ATTESTATION_STATION,
      abi,
      tempProvider
    );

    const trustKey = encodeRawKey(`trustsight.trust`);

    const eventKey = attestationStation.filters.AttestationCreated(
      null,
      address,
      trustKey
    );

    const events = await attestationStation.queryFilter(eventKey, 3451375);

    const fetchedEventMap = {};

    events.forEach(({ args }) => {
      const creator = args[0];
      if (creator === TRUSTSIGHT_ADDRESS) return;
      const encodedValue = args[3];
      const decodedValue = Number(encodedValue);
      fetchedEventMap[creator] = decodedValue;
    });

    setTrustScoresMap(fetchedEventMap);
    console.log("trustScoresMap: ", fetchedEventMap);
  }

  useEffect(() => {
    if (!address) return;
    fetchTrustSightScores();
    fetchAllTrustScores();
  }, [address]);

  useEffect(() => {
    if (!account || !account.subscores) return;

    const attestationDeepCopy = JSON.parse(JSON.stringify(attestationMap));

    const trustKey = encodeRawKey(`trustsight.trust`);

    const attestation = {
      about: address,
      key: trustKey,
      val: 0,
    };

    attestationDeepCopy["trust"] = attestation;

    account.subscores.forEach((subscore) => {
      const attestationKey = encodeRawKey(
        `trustsight.${account.category.toLowerCase()}.${subscore}`
      );

      const attestation = {
        about: address,
        key: attestationKey,
        val: 0,
      };

      attestationDeepCopy[subscore] = attestation;
    });
    setAttestationMap(attestationDeepCopy);
  }, [account, address]);

  if (!account || !eventLogMap) {
    account = {
      score: 0,
      address: address,
      reviews: 0,
      flags: 0,
    };
  }

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

  function handleSetScore(score: number, type: string) {
    const attestationDeepCopy = JSON.parse(JSON.stringify(attestationMap));

    if (score === attestationDeepCopy[type]["val"]) {
      attestationDeepCopy[type]["val"] = 0;
      setAttestationMap(attestationDeepCopy);
    } else {
      attestationDeepCopy[type]["val"] = score * 100;
      setAttestationMap(attestationDeepCopy);
    }

    console.log(attestationDeepCopy[type]);
  }

  function triggerCypher() {
    window.Cypher({
      address: connectedAddress,
      targetChainIdHex: "0xa",
      requiredTokenBalance: 0.01,
      isTestnet: false,
      callBack: () => {
        console.log("callBack called");
      },
    });
  }

  function handleReview() {
    if (!connectedAddress) {
      open();
    } else if (balance.value.lte(ethers.utils.parseEther("0.01"))) {
      triggerCypher();
    } else {
      onOpen();
    }
  }

  return (
    <main className={styles.main}>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent className={styles.modalContent}>
          <ModalHeader className={styles.modalHeader}>
            <Text className={styles.yourReview}>Your Review</Text>
          </ModalHeader>
          <ModalCloseButton />
          {isSuccess && data ? (
            <VStack className={styles.lottieContainer}>
              <SuccessLottie />
              <Text className={styles.subHeader} pb="1rem">
                Review successfully submitted!
              </Text>
            </VStack>
          ) : (
            <ModalBody>
              <VStack>
                <HStack className={styles.modalTopSection}>
                  <HStack>
                    {image ? (
                      <Image
                        src={image}
                        alt={image}
                        className={styles.modalImage}
                      ></Image>
                    ) : (
                      <Identicon
                        string={address as string}
                        className={styles.modalImage}
                      />
                    )}
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
                      {new Array(attestationMap["trust"]["val"] / 100)
                        .fill(0)
                        .map((_, idx) => (
                          <Image
                            src="/star.png"
                            alt="yo"
                            key={`star-${idx}`}
                            className={styles.largestar}
                            onClick={() => handleSetScore(idx + 1, "trust")}
                          />
                        ))}
                      {new Array(5 - attestationMap["trust"]["val"] / 100)
                        .fill(0)
                        .map((_, idx) => (
                          <Image
                            src="/blankstar.png"
                            alt="yo"
                            key={`blankstar-${idx}`}
                            className={styles.largestar}
                            onClick={() =>
                              handleSetScore(
                                attestationMap["trust"]["val"] / 100 + idx + 1,
                                "trust"
                              )
                            }
                          />
                        ))}
                    </HStack>
                  </HStack>
                </HStack>
                <Box h="10px"></Box>
                <HStack>
                  {category && (
                    <VStack className={styles.categoryPill}>
                      <Text className={styles.categoryPillText}>
                        {category}
                      </Text>
                    </VStack>
                  )}
                  <Text className={styles.subHeader}>
                    Category scores (optional)
                  </Text>
                </HStack>
                <Box h="10px"></Box>
                {subscores && subscores.length > 0 && (
                  <SimpleGrid columns={2} gap={6}>
                    {subscores.map((type) => (
                      <HStack key={type}>
                        <Text className={styles.subHeader} w="130px">
                          {capitalizeFirstLetter(type)}
                        </Text>
                        <HStack>
                          {new Array(
                            type in attestationMap
                              ? attestationMap[type]["val"] / 100
                              : 0
                          )
                            .fill(0)
                            .map((_, idx) => (
                              <Image
                                src="/star.png"
                                alt="yo"
                                key={`star-${idx}`}
                                className={styles.largestar}
                                onClick={() => handleSetScore(idx + 1, type)}
                              />
                            ))}
                          {new Array(
                            type in attestationMap
                              ? 5 - attestationMap[type]["val"] / 100
                              : 5
                          )
                            .fill(0)
                            .map((_, idx) => (
                              <Image
                                src="/blankstar.png"
                                alt="yo"
                                key={`blankstar-${idx}`}
                                className={styles.largestar}
                                onClick={() =>
                                  handleSetScore(
                                    attestationMap[type]["val"] / 100 + idx + 1,
                                    type
                                  )
                                }
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
          )}
          <ModalFooter className={styles.modalFooter}>
            {isSuccess && data ? (
              <ChakraLink
                isExternal
                href={`https://goerli-optimism.etherscan.io/tx/${data.hash}`}
              >
                <Button className={styles.submitButton}>
                  View Transaction
                </Button>
              </ChakraLink>
            ) : (
              <Button className={styles.submitButton} onClick={() => write?.()}>
                {isLoading ? <Spinner color="white" /> : "Submit Review"}
              </Button>
            )}
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
            <VStack onClick={handleReview} cursor="pointer">
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
                  {flags && (
                    <Text className={styles.reviewsSubtext}>
                      Reported by {flags} users
                    </Text>
                  )}
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
              <Text className={styles.scoreText}>
                {isNaN(eventLogMap["trustsight.trust"] / 100)
                  ? 0
                  : eventLogMap["trustsight.trust"] / 100}
              </Text>
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
                      <Box
                        className={styles.scoreBar}
                        width={`${
                          eventLogMap[
                            `trustsight.${category.toLowerCase()}.${val}`
                          ] / 5
                        }%`}
                      ></Box>
                    </Box>
                    <Text className={styles.categoryScore}>
                      {eventLogMap[
                        `trustsight.${category.toLowerCase()}.${val}`
                      ] / 100}
                    </Text>
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
                  <option value="option2">Most trusted</option>
                  <option value="option1">Most recent</option>
                </Select>
              </VStack>
              <Box w="10px"></Box>
              <Text className={styles.filterLabel}>Filter by:</Text>
              <VStack className={styles.select}>
                <Select variant="custom" onChange={handleSetFive}>
                  <option value="option1">Show all</option>
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
                    {/* {Object.entries(trustScoresMap).length > 0 ? (
                      Object.entries(trustScoresMap).map(([key, value]) => (
                        <HStack key={key} className={styles.reviewContainer}>
                          <VStack className={styles.leftReviewSection}>
                            <Identicon
                              string={key as string}
                              className={styles.reviewImage}
                            />
                            <Text className={styles.reviewReviewer}>
                              {abridgeAddress(key)}
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
                                {new Array((value as number) / 100)
                                  .fill(0)
                                  .map((_, idx) => (
                                    <Image
                                      src="/star.png"
                                      alt="yo"
                                      key={idx}
                                      className={styles.star}
                                    />
                                  ))}
                                {new Array(5 - (value as number) / 100)
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
                              Unavailable
                            </Text>
                          </VStack>
                        </HStack>
                      ))
                    ) : (
                      <Text>No reviews available.</Text>
                    )} */}
                    {reviewList ? (
                      reviewList
                        .filter((val) => (five ? val.stars === 500 : true))
                        .map(
                          ({ reviewer, score, stars, review, createdAt }) => (
                            <HStack
                              key={reviewer}
                              className={styles.reviewContainer}
                            >
                              <VStack className={styles.leftReviewSection}>
                                <Identicon
                                  string={reviewer as string}
                                  className={styles.reviewImage}
                                />
                                <Text className={styles.reviewReviewer}>
                                  {abridgeAddress(reviewer)}
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
                                    {new Array(Math.round(stars / 100))
                                      .fill(0)
                                      .map((_, idx) => (
                                        <Image
                                          src="/star.png"
                                          alt="yo"
                                          key={idx}
                                          className={styles.star}
                                        />
                                      ))}
                                    {new Array(5 - Math.round(stars / 100))
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
                    {Object.entries(trustScoresMap).length > 0 ? (
                      Object.entries(trustScoresMap).map(([key, value]) => (
                        <HStack key={key} className={styles.reviewContainer}>
                          <VStack className={styles.leftReviewSection}>
                            <Image
                              alt={key}
                              src={image}
                              className={styles.reviewImage}
                            />
                            <Text className={styles.reviewReviewer}>
                              {abridgeAddress(key)}
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
                              <HStack w="100%">
                                {new Array((value as number) / 100)
                                  .fill(0)
                                  .map((_, idx) => (
                                    <Image
                                      src="/star.png"
                                      alt="yo"
                                      key={idx}
                                      className={styles.star}
                                    />
                                  ))}
                                {new Array(5 - (value as number) / 100)
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
                              Unavailable
                            </Text>
                          </VStack>
                        </HStack>
                      ))
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

export default withTransition(Profile);
