const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
let user
let token

beforeAll(async () => {
    await User.deleteMany({})

    const newUser = {
        "username": "root",
        "name": "Superuser",
        "password": "salainen"
    }
    user = await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const loginInfo = await api.post('/api/login')
        .send(newUser)
        .expect(200)
    token = "bearer " + loginInfo.body.token
    console.log('outer before all')
})
beforeEach(async () => {
    // TODO promise
    await Blog.deleteMany({})

    const blogs = helper.initialBlogs
    const blogObjects = blogs.map(blog => {
            return new Blog({...blog, user: user.body.id})
        }
    )
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('there are six posts', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(6)
})

test('Exercise 4.9. verifies that the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(blog => {
        expect(blog.id).toBeDefined()
    })

})

test('Exercise 4.10. verifies blog post ', async () => {
    const newBlog = {
        title: "dummy",
        author: "dummy",
        url: "dummy",
        likes: 0
    }
    const postResponse = await api.post('/api/blogs').set('Authorization', token)
        .send(newBlog).expect(201)

    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length + 1)

    const userForMatch = {...user.body}
    delete userForMatch.blogs
    const expectedBlog = {...newBlog, id: postResponse.body.id, user: userForMatch}

    expect(response.body).toContainEqual(expectedBlog)

})

test('Exercise 4.11. verifies missing property is like ,it wil will be set 0 by default', async () => {
    const newBlog = {
        title: "dummy",
        author: "dummy",
        url: "dummy",
    }

    const postResponse = await api.post('/api/blogs').send(newBlog).set('Authorization', token).expect(201)
    await api.get(`/api/blogs/${postResponse.body.id}`).expect(200)

    const blogs = await helper.blogsInDb()
    let targetBlog = blogs.slice(-1)[0];
    expect(targetBlog.likes).toBe(0)
})

test('Exercise 4.12', async () => {
    const newBlog = {
        url: "dummy",
    }
    await api.post('/api/blogs').send(newBlog).set('Authorization', token).expect(400)
})

test('Exercise 4.13 verify get by id work', async () => {

    const sampleBlogs = await helper.blogsInDb()

    const response = await api.get(`/api/blogs/${sampleBlogs[0].id}`).expect(200)

    const userForMatch = {...user.body}
    delete userForMatch.blogs

    expect(response.body).toEqual({...sampleBlogs[0], user: userForMatch})
})

test('Exercise 4.13 verify delete by id work', async () => {
    const sampleBlogs = await helper.blogsInDb()

    await api.delete(`/api/blogs/${sampleBlogs[0].id}`).set('Authorization', token).expect(204)

    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(helper.initialBlogs.length - 1)

    expect(blogs).not.toContainEqual(sampleBlogs)
})

test('Exercise 4.14 verify update like', async () => {
    const after = 10
    const newBlog = {...helper.initialBlogs[0], likes: after}

    const sampleBlogs = await helper.blogsInDb()

    await api.put(`/api/blogs/${sampleBlogs[0].id}`)
        .send(newBlog).expect(201)

    const blogs = await helper.blogsInDb()

    expect(blogs[0].likes).toEqual(after)
})

afterAll(() => {
    mongoose.connection.close()
})