import { useEffect, useState } from "react";
import Header from "./Header";
import { data, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { FaHeart } from 'react-icons/fa';
import './Home.css'



function Home() {

    const navigate = useNavigate()

    const [products, setproducts] = useState([]);
    const [cproducts, setcproducts] = useState([]);
    const [search, setsearch] = useState('');
    const [issearch, setissearch] = useState(false);
    // const [cat, setcat] = useState('');
    // useEffect(() => {
    //     if (!localStorage.getItem('token')) {
    //         navigator('/login')
    //     }
    // }, [])

    useEffect(() => {
        const url = 'http://localhost:4000/get-products';
        axios.get(url)
            .then((res) => {
                if (res.data.products) {
                    setproducts(res.data.products);
                }
            })
            .catch((err) => {
                alert('server err')
            })
    }, [])

    const handlesearch = (value) => {
        setsearch(value);
    }
    const handleClick = () => {

        const url = 'http://localhost:4000/search?search=' + search + '&loc=' + localStorage.getItem('userLoc');
        axios.get(url)
            .then((res) => {
                setcproducts(res.data.products)
                setissearch(true);
            })
            .catch((err) => {
                alert('server err')
            })

        // let filteredProducts = products.filter((item) => {
        //     console.log(item)
        //     if (item.pname.toLowerCase().includes(search.toLowerCase()) ||
        //         item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
        //         item.category.toLowerCase().includes(search.toLowerCase())) {
        //         return item;
        //     }
        // })
        // setcproducts(filteredProducts)
    }

    const handleCategory = (value) => {
        // setcat(value);
        let filteredProducts = products.filter((item, index) => {
            console.log(value, item, "v")
            if (item.category == value) {
                return item;
            }
        })
        setcproducts(filteredProducts)

    }

    const handleLike = (productId,e) => {
        e.stopPropagation();
        let userId = localStorage.getItem('userId')
        // console.log('userId', 'productId', productId, userId);
        if (!userId) {
            alert('Please login to like products');
            return;
        }

        const url = 'http://localhost:4000/like-product';
        const data = { userId, productId }
        axios.post(url, data)
            .then((res) => {
                // if (res.data.products) {
                //     setproducts(res.data.products);
                // }/
                console.log(res);
                if (res.data.message) {
                    alert('Liked')
                }
            })
            .catch((err) => {
                alert('server err')
            })
    }

    const handleProduct = (id) => {
        navigate('/product/' + id)
    }

    return (
        <div>

            <Header search={search} handlesearch={handlesearch} handleClick={handleClick} />
            <Categories handleCategory={handleCategory} />
            {/* {!!localStorage.getItem('token') && <Link to="/add-product"> <button className="logout-btn">ADD PRODUCT </button></Link>} */}

            {issearch && cproducts && 
            <h5>SEARCH RESULTS
                <button className="clear-btn" onClick={()=> setissearch(false)}>CLEAR</button>
                </h5>}
            {issearch && cproducts && cproducts.length == 0 && <h5>No Results Found</h5>}
            {issearch && <div className="d-flex justify-content-center flex-wrap">
                {cproducts && products.length > 0 &&
                    cproducts.map((item, index) => {
                        return (
                            <div key={item._id} className="card m-3">
                                <div onClick={() => handleLike(item._id)} className="icon-con">
                                    <FaHeart className="icons" />
                                </div>
                                <img width="250px" height="150px" src={'http://localhost:4000/' + item.pimg} />
                                <h3 className="m-2 price-text"> Rs. {item.price} /-</h3>
                                <p className="m-2">{item.pname} | {item.category}</p>
                                <p className="m-2 text-success">{item.pdesc}</p>


                            </div>
                        )
                    })}
            </div>}

            
            {!issearch && <div className="d-flex justify-content-center flex-wrap">
                {products && products.length > 0 &&
                    products.map((item, index) => {
                        return (
                            <div onClick={() => handleProduct(item._id)} key={item._id} className="card m-3">
                                <div onClick={(e) => handleLike(item._id, e)} className="icon-con">
                                    <FaHeart className="icons" />

                                    {/* <FaHeart style={{ color: 'red', fontSize: '30px' }} /> */}
                                </div>

                                <img width="250px" height="150px" src={'http://localhost:4000/' + item.pimg} />
                                <h3 className="m-2 price-text"> Rs. {item.price} /-</h3>
                                <p className="m-2">{item.pname} | {item.category}</p>
                                <p className="m-2 text-success">{item.pdesc}</p>


                            </div>
                        )
                    })}
            </div>}


        </div>
    )
}

export default Home;