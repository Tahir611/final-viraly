import { Box, Typography, Container } from "@mui/material";
import React from "react";
import Navbar from "@/components/AppBar/AppBar";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Image from "next/image";
import SelectPageContent from "@/components/SelectPage/SelectPageContent";
import SelectPostContent from "@/components/SelectPost/SelectPostContent";
import ChooseOptionContent from "@/components/ChooseOptions/ChooseOptionContent";
import PickWinner from "@/components/PickWinner/PickWinner";
import { useEffect } from "react";
import axios from "axios";

const SelectFbPageCopy = () => {
  const [selectTab, setselectedTab] = useState("Select a page");
  const [currentTabIndex, setcurrentTabIndex] = useState(0);
  const [pages, setPages] = useState(null);
  const [posts, setPosts] = useState(null);
  const [postId, setPostId] = useState(null);
  const [commentData, setCommentData] = useState(null);
  // console.log(posts, postId)
  let myPages = []
  const [contestData, setContestData] = useState({
    page: "",
    postText: "",
    img: "",
    conditions: {},
  });
  // dynamic content for side container
  const saveContestData = (e) => {
    // console.log(e.target.value)
  };

  // conditionally rendering the components
  const arrayOfComponents = [
    SelectPageContent,
    SelectPostContent,
    ChooseOptionContent,
    PickWinner,
  ];
  const decrement = (e) => {
    e.preventDefault();
    currentTabIndex !== 0 ? setcurrentTabIndex(currentTabIndex - 1) : null;
  };
  const increment = (e) => {
    e.preventDefault();
    currentTabIndex !== arrayOfComponents.length
      ? setcurrentTabIndex(currentTabIndex + 1)
      : null;
  };

  // BUTTONS
  const selectButtons = [
    "Select a page",
    "Select a post",
    "Choose options",
    "Pick a winner",
  ];

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const handleSelect = (e, i) => {
    e.preventDefault();
    const tab = e.target.dataset.tab;
    setselectedTab(tab);
    setcurrentTabIndex(i);
  };
  function truncatePost(post) {
    const truncatedIdLength = 100;
    if (post.length <= truncatedIdLength) {
      return post;
    } else {
      return post.substring(0, truncatedIdLength) + "...";
    }
  }

  useEffect(() => {
    const fetchPages = async () => {
      const formData = new FormData();
      formData.append("user_id", "#41fd5994c08918b5889c82c05b2723aa");
      formData.append("resource", "facebook");

      try {
        const response = await axios.post(
          "http://localhost/viralyIO/api/includes/actions.php",
          formData
        );
        setPages(response?.data.pages)
      } catch (error) {
        console.log(error);
      }
    };
    fetchPages();
  }, []);

  for(const page in pages) {
    // myPages.push({`${page}: ${pages[page]}`});
    myPages.push({
      id: page,
      page: pages[page]
    })
  }

  return (
    <>
      <Navbar />
      <Container className="SP_container" maxWidth="xl">
        <Box className="">
          <Grid container spacing={2} className="select-button-container">
            {selectButtons.map((item, i) => {
              return (
                <Grid className="btn-grid" item xs={3} key={i}>
                  <Item
                    disabled={i > currentTabIndex}
                    onClick={(e) => handleSelect(e, i)}
                    data-tab={item}
                    className={`list_items ${
                      currentTabIndex === i ? "active_li" : null
                    }`}
                  >
                    <span className="button_list_number"> {`${i + 1}.`}</span>{" "}
                    {`${item}`}
                  </Item>
                </Grid>
              );
            })}
          </Grid>
          <div className="content_div">
            <div className="CP_inner_container">
              {arrayOfComponents.map((Component, index) =>
                index === currentTabIndex ? (
                  <Component
                    setContestData={setContestData}
                    saveContestData={saveContestData}
                    decrement={decrement}
                    increment={increment}
                    key={index}
                    pages={myPages}
                    setPosts= {setPosts}
                    posts= {posts}
                    setPostId = {setPostId}
                    postId = {postId}
                    setCommentData = {setCommentData}
                    commentData = {commentData}
                  />
                ) : null
              )}
            </div>

            <div className="side_container">
              <div className="image_container">
                <Image
                  width="115"
                  height="115"
                  alt="fblogo"
                  src="/fbround.png"
                />
              </div>
              <div className="side_text">
                <Typography className="contest">Facebook Contest</Typography>
                <div className="page">
                  <Typography sx={{ pb: "10px", fontFamily: "Catamaran" }}>
                    Page
                  </Typography>
                  <Typography sx={{ pb: "15px" }} className="fb-box-condition">
                    {contestData.page}
                  </Typography>
                  <Typography sx={{ pb: "10px", fontFamily: "Catamaran" }}>
                    Post
                  </Typography>
                  {contestData.postText?.length !== 0 ? (
                    <div className="side_card_box">
                      <Typography className="sideboxcardtext">
                        {truncatePost(contestData.postText)}
                      </Typography>
                      <img
                        src={contestData.img}
                        className="sideboximg"
                        alt="post-img"
                      />
                    </div>
                  ) : (
                    ""
                  )}

                  <Typography
                    sx={{ pb: "10px", pt: "20px", fontFamily: "Catamaran" }}
                  >
                    Conditions
                  </Typography>

                  {Object.entries(contestData?.conditions).map(
                    ([key, value]) => (
                      <Typography
                        sx={{ pb: "5px" }}
                        className="fb-box-condition"
                        key={key}
                      >
                        {value !== "" ? value : ""}
                      </Typography>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </Box>
      </Container>
    </>
  );
};

export default SelectFbPageCopy;
