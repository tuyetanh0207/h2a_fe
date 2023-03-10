import React, { useEffect, useState } from "react";
import "./serviceFree.css";
import { Link } from "react-router-dom";
import ButtonCT from "../../components/buttonCT/ButtonCT";
import Tag from "./Tag/Tag";
import { tagsRoom, tagsTree } from "./tagsData";
import { axiosClient } from "../../api/axios";

const ServiceFree = () => {
  const [isLoading, setLoading] = useState(false);
  const [type, setType] = useState("tree");
  const [dataTags, setDataTags] = useState(tagsTree);
  const [selectedTags, setSelectedTags] = useState([]);
  const [textSearch, setTextSearch] = useState("");
  const [dataSearch, setDataSearch] = useState([]);
  const [response, setResponse] = useState([]);

  const handleSelect = (id) => {
    setSelectedTags([...selectedTags, id]);
    const newDataTags = dataTags;
    newDataTags[id.substring(1)][id[0]].status = true;
    setDataTags(newDataTags);
    const newDataSearch = dataSearch.map((item) => {
      if (item.code === id) {
        item.item.status = true;
      }
      return item;
    });
    setDataSearch(newDataSearch);
  };

  const handleUnselected = (id) => {
    dataTags[id.substring(1)][id[0]].status = false;
    const newSelected = selectedTags.filter((item) => item !== id);
    setSelectedTags(newSelected);
  };

  const handleSearch = (e) => {
    setTextSearch(e.target.value);

    const data = [];
    for (const x in dataTags) {
      for (let i = 0; i < dataTags[x].length; i++) {
        if (
          dataTags[x][i].des
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        ) {
          data.push({
            code: `${i}${x}`,
            item: dataTags[x][i],
          });
        }
      }
    }

    setDataSearch(data);
  };

  const handleSubmit = () => {
    setTextSearch('')
    let url = "/trees/?page=1";
    if (type === 'room')
     url = "/rooms-match/?page=1";
     
    selectedTags.map((item) => {
      url += "&" + item.substring(1) + "=" + item[0];
    });

    setLoading(true);
    axiosClient
      .get(url)
      .then((res) => {
        console.log(res);
        setResponse(res.content);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    console.log(url);
  };

  useEffect(() => {
    if (type === "tree") setDataTags(tagsTree);
    else setDataTags(tagsRoom);

    setSelectedTags([]);
    setTextSearch("");
    setDataSearch([]);
    setResponse([]);

    // console.log(response);
  }, [type]);

  return (
    <div className="serviceFree">
      <div className="serviceFree__heading">
        <h3 className="text-3xl text-white font-semibold">
          TRANG TR?? NH?? NGAY
        </h3>
        <div>
          <Link to="/home" className="text-lg text-slate-200 pr-2">
            TRANG CH???
          </Link>
          <Link
            to="/services/premium"
            className="text-lg text-amber-500 pl-2"
            style={{ borderLeft: "1px solid #ccc", color: "#FFDE68" }}
          >
            D???CH V??? T?? V???N
          </Link>
        </div>
      </div>

      <div className="serviceFree__content">
        <ul className="serviceFree__navbar">
          <li
            className={`${type === "tree" ? "navbar-active" : ""}`}
            onClick={() => setType("tree")}
          >
            Ch???n c??y
          </li>
          <li
            className={`${type === "room" ? "navbar-active" : ""}`}
            onClick={() => setType("room")}
          >
            B??? tr?? ph??ng
          </li>
        </ul>

        <div className="serviceFree__workspace">
          <div className="workspace__item">
            <div>
              {type === "tree" ? (
                <h5>Nh???p mong mu???n c???a b???n v??? c??y</h5>
              ) : (
                <h5>Nh???p mong mu???n c???a b???n v??? ph??ng</h5>
              )}
              <div className="w-full relative">
                <input type="text" value={textSearch} onChange={handleSearch} />
                {textSearch !== "" && (
                  <ul className="workspace__item-dropdown">
                    {dataSearch.map((item) => {
                      if (!item.item.status) {
                        return (
                          <li
                            key={item.code}
                            onClick={() => handleSelect(item.code)}
                          >
                            {item.item.des}
                          </li>
                        );
                      }
                      return ''
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div>
              {type === "tree" ? <h6>Lo???i c??y</h6> : <h6>Lo???i ph??ng</h6>}
              {dataTags[Object.keys(dataTags)[0]].map((item, idx) => {
                if (!item.status) {
                  return (
                    <span key={`${idx}${Object.keys(dataTags)[0]}`}>
                      <Tag
                        content={item.des}
                        onClick={(e) =>
                          handleSelect(`${idx}${Object.keys(dataTags)[0]}`)
                        }
                      />
                    </span>
                  );
                }
                return "";
              })}
            </div>

            <div>
              {type === "tree" ? (
                <h6>Ch??? ????? ch??m s??c</h6>
              ) : (
                <h6>K??ch th?????c ph??ng</h6>
              )}
              {dataTags[Object.keys(dataTags)[1]].map((item, idx) => {
                if (!item.status) {
                  return (
                    <span key={`${idx}${Object.keys(dataTags)[1]}`}>
                      <Tag
                        content={item.des}
                        onClick={(e) =>
                          handleSelect(`${idx}${Object.keys(dataTags)[1]}`)
                        }
                      />
                    </span>
                  );
                }
                return "";
              })}
            </div>

            <div>
              {type === "tree" ? (
                <h6>Lo???i l??</h6>
              ) : (
                <h6>H?????ng ph??ng</h6>
              )}
              {dataTags[Object.keys(dataTags)[2]].map((item, idx) => {
                if (!item.status) {
                  return (
                    <span key={`${idx}${Object.keys(dataTags)[2]}`}>
                      <Tag
                        content={item.des}
                        onClick={(e) =>
                          handleSelect(`${idx}${Object.keys(dataTags)[2]}`)
                        }
                      />
                    </span>
                  );
                }
                return "";
              })}
            </div>

            <ButtonCT
              onClick={handleSubmit}
              className="workspace__item-btn"
              primary
              large
              loading={isLoading}
            >
              Xem g???i ?? ngay
            </ButtonCT>
          </div>
          <div className="workspace__item">
            <h5>Tags ???? ch???n</h5>
            <div className="tags-list">
              {selectedTags.map((item, idx) => (
                <span key={+idx}>
                  <Tag
                    content={dataTags[item.substring(1)][item[0]].des}
                    icon
                    onClick={() => handleUnselected(item)}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {response.length !== 0 ?
          <div className="serviceFree__result">
            <h6>K???t qu??? g???i ??</h6>
            <div className="result__list">
              {response.map((item, idx) => (
                <div className="result__item" key={+idx}>
                  <img className="m-auto" src={item.image} alt="" />
                  <div className="result__item-description">
                    <h3>{item?.name}</h3>
                    {type === 'tree'
                      ? <ul className="description__list">
                      <li className="description__list-item">
                        <span>M?? t???: </span>
                        <p>{item?.description}</p>
                      </li>
                      <li className="description__list-item">
                        <span>Lo???i l??: </span>
                        <p>{item?.leafType ? dataTags['leafType'][+item?.leafType]?.des : ''}</p>
                      </li>
                      <li className="description__list-item">
                        <span>N??i b??n: </span>
                        <p>{item?.sellLocation}</p>
                      </li>
                    </ul>
                    : <ul className="description__list">
                    <li className="description__list-item">
                      <span>Lo???i ph??ng: </span>
                      <p>{item?.roomType ? dataTags['roomType'][item?.roomType]?.des : ''}</p>
                    </li>
                    <li className="description__list-item">
                      <span>K??ch th?????c ph??ng: </span>
                      <p>{item?.roomSizeType ? dataTags['roomSizeType'][item?.roomSizeType]?.des : ''}</p>
                    </li>
                    <li className="description__list-item">
                      <span>C??y ph?? h???p: </span>
                      <p>{item.matchingTrees ? item.matchingTrees.map(e => e.name) : ''}</p>
                    </li>
                  </ul>
                  }
                </div>
              </div>
            ))}
            </div>
          </div> 
          : ''
        }
      </div>
    </div>
  );
};

export default ServiceFree;
