import React, { Component } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import apiKey from "./Constant.js";

import { Input, Card, Col, Row, Icon, Layout, Menu, Breadcrumb } from "antd";
import "antd/dist/antd.css";

const Search = Input.Search;
const { Meta } = Card;
const { Header, Content, Footer } = Layout;

class App extends Component {
  state = {
    cravings: [],
    fav: [],
    searchedText: ""
  };

  async getCravings(recipeName) {
    console.log(recipeName);
    const apiCall = await fetch(
      `https://www.food2fork.com/api/search?key=${apiKey}&q=${recipeName}&count=20`
    );
    const data = await apiCall.json();
    this.setState({ cravings: data.recipes });

    const recipesData = JSON.stringify(data.recipes);
    localStorage.setItem("recipesData", recipesData);

    console.log(this.state.cravings);
  }

  componentDidMount = () => {
    const json = localStorage.getItem("recipesData");
    const recipes = JSON.parse(json);
    console.log(recipes);
    if (recipes != null) {
      this.setState({ cravings: recipes });
    }

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
        var temp = responseJson.map(a => a.recipe_id);
        this.setState({
          fav: temp
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentDidUpdate = () => {
    const recipes = JSON.stringify(this.state.cravings);
    localStorage.setItem("recipes", recipes);
  };

  cardSave = recipe => {
    var url =
      "http://localhost:3005/addToFav?cardId=" +
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
          fav: this.state.fav.filter(item => item !== recipe.recipe_id)
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
            defaultSelectedKeys={["1"]}
            style={{
              lineHeight: "64px",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Menu.Item key="1">Home</Menu.Item>
            <Menu.Item key="2">
              <Link to={{ pathname: "/fav" }}>Fav</Link>
            </Menu.Item>
            <Menu.Item
              style={{
                flex: 1
              }}
            >
              <Search
                style={{
                  verticalAlign: "middle",
                  margin: 0,
                  flex: 1
                }}
                placeholder="input search text"
                enterButton="Search"
                size="large"
                onChange={e => this.setState({ searchedText: e.target.value })}
                onSearch={() => this.getCravings(this.state.searchedText)}
              />
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} />
          <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
            <div style={{ background: "#ECECEC", padding: "30px" }}>
              {this.state.cravings.length > 0 && (
                <Row gutter={16}>
                  {this.state.cravings.map((recipe, index) => {
                    return (
                      <Col span={6} key={recipe.recipe_id}>
                        <Card
                          style={{ width: 400, marginBottom: 15 }}
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
                  <h5>Search for Recipe</h5>
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

export default App;
