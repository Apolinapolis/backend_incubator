import request from 'supertest'
import { ObjectId } from 'mongodb'
import { app } from '../../src/app'
import { mongoUri } from '../../src/repositories/db'
import { HTTP_STATUSES } from '../../src/utils'
import mongoose from 'mongoose'
import { CreateBroModel, UserDBType } from '../../src/types'

let firstBro:UserDBType
const nonExistingId = new ObjectId().toString()

describe('/bro', () => {

  beforeAll(async () => {
    await mongoose.connect(mongoUri)
    await request(app).delete('/bro/all')
  })
  beforeAll(async () => {
    await request(app).delete('/bro/all')
  })

  it('should return 200 ok and empty array', async () => {
    await request(app)
      .get('/bro')
      .expect(HTTP_STATUSES.OK_200, [])
  })

  it('should return 404 for non-existing brother', async () => {

    await request(app)
      .get(`/bro/${nonExistingId}`)
      .expect(HTTP_STATUSES.NOT_FOUND_404)
  })

  it('should return 400 without user name', async () => {

    const testUser: CreateBroModel = { userName: "", bio: "golden mine" }

    await request(app)
      .post('/bro')
      .send(testUser)
      .expect(HTTP_STATUSES.BAD_REQUEST_400)

    await request(app)
      .get('/bro')
      .expect(HTTP_STATUSES.OK_200, [])
  })

  it('should create bro with correct input data', async () => {

    const testUser: CreateBroModel = { userName: "Довганюк", bio: "golden mine" }

    await request(app)
      .post('/bro')
      .send(testUser)
      .expect(HTTP_STATUSES.CREATED_201)

    const getAllResponse = await request(app)
      .get('/bro')
      .expect(HTTP_STATUSES.OK_200)

    firstBro = getAllResponse.body[0] // обновляю данные глобально

    expect(getAllResponse.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),
          userName: testUser.userName,
          bio: testUser.bio,
          addedAt: expect.any(String),
          avatars: [
            {
              _id: expect.any(String),
              addedAt: expect.any(String),
              src: expect.any(String)
            }
          ]
        }
        )
      ]
      ))
  })

  it('should update bro with correct input data', async () => {

    const updatedUser: CreateBroModel = { userName: "Измененный", bio: "Данные были изменены при тесте" }

    await request(app)
      .put(`/bro/${firstBro._id}`)
      .send(updatedUser)
      .expect(HTTP_STATUSES.NO_CONTENT_204)

    // проверяю, что изменения применились
    const getAllResponse = await request(app)
      .get('/bro')
      .expect(HTTP_STATUSES.OK_200)

    firstBro = getAllResponse.body[0] // обновляю данные глобально
    expect(firstBro).toMatchObject({
      userName: updatedUser.userName,
      bio: updatedUser.bio
    })
  })

// TODO вынести payload глобально

  it('should delete exitsting BRO', async () => {
      await request(app)
          .delete(`/bro/${firstBro._id}`)
          .expect(HTTP_STATUSES.OK_200)

      await request(app)
          .get('/bro')
          .expect(HTTP_STATUSES.OK_200, [])
  })

  it('should return 404 if nothink to delete', async () => {
      await request(app)
          .delete('/bro'+ nonExistingId)
          .expect(HTTP_STATUSES.NOT_FOUND_404)

      await request(app)
          .get('/bro')
          .expect(HTTP_STATUSES.OK_200, [])
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })
})