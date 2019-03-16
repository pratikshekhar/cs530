import React, { Component } from "react";

import apiKey from "../Constant.js";
import { Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from "antd";
import "antd/dist/antd.css";
import { Card, Col, Row, Icon } from "antd";

const { Meta } = Card;
const { Header, Content, Footer } = Layout;

class Fav extends Component {
  state = {
    cravings: [],
    fav: []
  };

  getCravings = async e => {
    const recipeName = e.target.elements.recipeName.value;
    e.preventDefault();
    const apiCall = await fetch(
      `https://www.food2fork.com/api/search?key=${apiKey}&q=${recipeName}&count=20`
    );
    const data = await apiCall.json();
    this.setState({ cravings: data.recipes });
    console.log(this.state.cravings);
  };

  componentDidMount = () => {
    // const json = localStorage.getItem("recipes");
    // const recipes = JSON.parse(json);
    // this.setState({ cravings: recipes });
    var url = "http://localhost:3005/getFav?userName=pratik";
    fetch(url, {
      method: "GET",
      mode: "cors"
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res;
      })
      .then(res => res.json())
      .then(responseJson => {
        console.log(responseJson);
        this.setState({ cravings: responseJson });
        var temp = responseJson.map(a => a.recipe_id);
        console.log(temp);
        this.setState({
          fav: temp
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidUpdate = () => {
    // const recipes = JSON.stringify(this.state.cravings);
    // localStorage.setItem("recipes", recipes);
  };

  cardSave = recipe => {
    var url =
      "http://localhost:3005/addToFav?cardId=" +
      JSON.stringify(recipe) +
      "&&userName=pratik";
    fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res;
      })
      .then(responseJson => {
        this.setState({
          fav: [...this.state.fav, recipe.recipe_id]
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  cardUnsave = recipe => {
    var url =
      "http://localhost:3005/removeFromFav?cardId=" +
      JSON.stringify(recipe) +
      "&&userName=pratik";
    fetch(url, {
      method: "GET",
      mode: "cors"
    })
      .then(res => {
        if (!res.ok) {
          throw Error(res.statusText);
        }
        return res;
      })
      .then(responseJson => {
        this.setState({
          fav: this.state.fav.filter(item => item !== recipe.recipe_id),
          cravings: this.state.cravings.filter(item => item !== recipe)
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getHeartColor = id => {
    if (this.state.fav.includes(id)) {
      return { color: "red" };
    } else {
      return { color: null };
    }
  };

  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["2"]}
            style={{ lineHeight: "64px" }}
          >
            <Menu.Item key="1">
              <Link to={{ pathname: "/" }}>Home</Link>
            </Menu.Item>
            <Menu.Item key="2">Fav</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} />

          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
            <div
              style={{
                background: "#ECECEC",
                padding: "30px",
                flexDirection: "row",
                flexWrap: "wrap"
              }}
            >
              {this.state.cravings.length > 0 && (
                <Row style={{ overflow: "hidden" }}>
                  {this.state.cravings.map((recipe, index) => {
                    return (
                      <Col span={8} key={recipe.recipe_id}>
                        <Card
                          style={{
                            marginBottom: 20,
                            marginLeft: 9,
                            marginRight: 9,
                            minWidth: 310,
                            maxWidth: 430
                          }}
                          cover={<img alt="example" src={recipe.image_url} />}
                          actions={[
                            <Icon
                              type="heart"
                              style={this.getHeartColor(recipe.recipe_id)}
                              theme={
                                this.state.fav.includes(recipe.recipe_id)
                                  ? "filled"
                                  : "outlined"
                              }
                              onClick={() =>
                                this.state.fav.includes(recipe.recipe_id)
                                  ? this.cardUnsave(recipe)
                                  : this.cardSave(recipe)
                              }
                            />,
                            <Icon
                              type="global"
                              onClick={() => window.open(recipe.publisher_url)}
                            />
                          ]}
                        >
                          <Meta
                            title={recipe.title}
                            description={recipe.publisher}
                          />
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              )}
              {this.state.cravings.length === 0 && (
                <div
                  style={{
                    textAlign: "center"
                  }}
                >
                  <h5>No Fav Recipe</h5>
                </div>
              )}
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    );
  }
}

export default Fav;
