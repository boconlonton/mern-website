import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import Navigation from "../components/Navigation";
import Header from "../components/Header";
import IPageProps from "../interfaces/page";
import IBlog from "../interfaces/blog";
import axios from "axios";
import config from "../config/config";
import logging from "../config/logging";
import LoadingComponent from "../components/LoadingComponent";
import { Link } from "react-router-dom";
import BlogPreview from "../components/BlogPreview";
import IUser from "../interfaces/user";
import ErrorText from "../components/ErrorText";

const HomePage: React.FunctionComponent<IPageProps> = props => {
    const [blogs, setBlogs] = useState<IBlog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        GetAllBlogs();
    }, [])

    const GetAllBlogs = async () => {
        try
        {
            const response = await axios({
                method: 'GET',
                url: `${config.server.url}/blogs`
            });

            if (response.status === 200 || response.status === 304)
            {
                let blogs = response.data.blogs as IBlog[];
                blogs.sort((x, y) => y.updatedAt.localeCompare(x.updatedAt));
                setBlogs(blogs);
            }
        }
        catch (error)
        {
            logging.error(error);
            setError('Unable to retrieve blogs');
        }
        finally
        {
            setTimeout(() => {
                setLoading(false)
            }, 1000);
        }
    }
    if (loading)
    {
        return <LoadingComponent>Loading blogs ...</LoadingComponent>
    }
    return (
        <>
        <Container fluid className="p-0">
            <Navigation/>
            <Header 
                title="Welcome to bocon's Blog"
                headline="To go up, dig down!"
            />
        </Container>
        <Container className="mt-5">
            {blogs.length === 0 && <p>There are no blogs yet, you should <Link to="/edit">post</Link> one 😄.</p>}
            {blogs.map((blog, index) => {
                console.log(blog);
                return (
                    <div key={index}>
                        <BlogPreview
                            _id={blog._id}
                            author={(blog.author as IUser).name}
                            headline={blog.headline}
                            title={blog.title}
                            createdAt={blog.createdAt}
                            updatedAt={blog.updatedAt}
                        />
                        <hr/>
                    </div>
                );
            })}
            <ErrorText error={error}/>
        </Container>
        </>
    )
}

export default HomePage; 