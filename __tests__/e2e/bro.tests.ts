import request from 'supertest'
import { ObjectId } from 'mongodb'
import { app } from '../../src/app'
import { mongoUri } from '../../src/repositories/db'
import { HTTP_STATUSES } from '../../src/utils'
import mongoose from 'mongoose'
import { CreateBroModel, UserDBType } from '../../src/types'

let firstBro: UserDBType
const nonExistingId = new ObjectId().toString()
const testUser: CreateBroModel = { userName: "", bio: "golden mine" }

describe('/bro API e2e', () => {

  beforeAll(async () => {
    await mongoose.connect(mongoUri)
    await request(app).delete('/bro/all')
  })

  describe('GET /bro (empty state)', () => {
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
  })

  describe('POST /bro', () => {
    it('should return 400 without user name', async () => {
      await request(app)
        .post('/bro')
        .send(testUser)
        .expect(HTTP_STATUSES.BAD_REQUEST_400)

      await request(app)
        .get('/bro')
        .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 400 if name is too short', async () => {
      const res = await request(app)
        .post('/bro')
        .send({ userName: 'A', bio: 25 })
        .expect(400)

      expect(res.body.errors).toEqual([expect.objectContaining({ path: 'userName' })])
    })

    it('should return 400 if name is too long', async () => {
      const res = await request(app)
        .post('/bro')
        .send({ userName: 'A'.repeat(101), bio: 25 })
        .expect(400)

      expect(res.body.errors).toEqual([expect.objectContaining({ path: 'userName' })])
    })

    it('should create bro with correct input data', async () => {
      //обновляю данные тестовой сущности
      testUser.userName = "Довганюк"

      await request(app)
        .post('/bro')
        .send(testUser)
        .expect(HTTP_STATUSES.CREATED_201)

      const getAllResponse = await request(app)
        .get('/bro')
        .expect(HTTP_STATUSES.OK_200)
      // обновляю данные глобально
      firstBro = getAllResponse.body[0]
      // проверяю тело ответа
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
  })

  describe('PUT /bro/:id', () => {
    it('should return 400 if name is too short', async () => {
      const res = await request(app)
        .put(`/bro/${firstBro._id}`)
        .send({ userName: 'c', bio: 'broken payload' })
        .expect(400)

      expect(res.body.errors).toEqual([expect.objectContaining({ path: 'userName' })])
    })

    it('should return 404 for updating non-existing bro', async () => {
      await request(app)
        .put(`/bro/${nonExistingId}`)
        .send(testUser)
        .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should update bro with correct input data', async () => {
      //изменяю данные тестовой сущности
      testUser.userName = "Измененный"
      testUser.bio = "Данные были изменены при тесте"

      await request(app)
        .put(`/bro/${firstBro._id}`)
        .send(testUser)
        .expect(HTTP_STATUSES.NO_CONTENT_204)

      // проверяю, что изменения применились
      const getAllResponse = await request(app)
        .get('/bro')
        .expect(HTTP_STATUSES.OK_200)
      // обновляю данные глобально
      firstBro = getAllResponse.body[0]
      expect(firstBro).toMatchObject({
        userName: testUser.userName,
        bio: testUser.bio
      })
    })
  })

  describe('DELETE /bro/:id', () => {
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
        .delete('/bro' + nonExistingId)
        .expect(HTTP_STATUSES.NOT_FOUND_404)

      await request(app)
        .get('/bro')
        .expect(HTTP_STATUSES.OK_200, [])
    })
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })
})