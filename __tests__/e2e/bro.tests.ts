import request from 'supertest'
import { app, db, HTTP_STATUSES } from '../../src'

describe('/brothers', () => {

    beforeAll(async () => {
        await request(app).delete('/__test__/data')
    })

    it('should return 200 ok and empty array', async () => {
        await request(app)
            .get('/brothers')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 for not existing brother', async () => {
        await request(app)
            .get('/brothers/93939')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should return 400 with empty payload', async () => {
        await request(app)
            .post('/brothers')
            .send({ title: '' })
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get('/brothers')
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should create bro with correct input data', async () => {
        await request(app)
            .post('/brothers/')
            .send({ title: 'Konstantin' })
            .expect(HTTP_STATUSES.CREATED_201)

        await request(app)
            .get('/brothers')
            .expect(HTTP_STATUSES.OK_200, db.courses)
    })

        it('should not update bro that not exist', async () => {
        await request(app)
            .put('/brothers/' + 2)
            .send({ title: 'correct title' })
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

        it('should update bro with correct input data', async () => {
        await request(app)
            .put('/brothers/' + db.courses[0].id)
            .send({ title: 'Updated_BRO' })
            .expect(HTTP_STATUSES.NO_CONTENT_204)
    })

        
        it('should delete exitsting BRO', async () => {
        await request(app)
            .delete('/brothers/' + db.courses[0].id)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

         await request(app)
            .get('/brothers')
            .expect(HTTP_STATUSES.OK_200, [])
    })

            it('should return 404 if nothink to delete', async () => {
        await request(app)
            .delete('/brothers/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)

         await request(app)
            .get('/brothers')
            .expect(HTTP_STATUSES.OK_200, [])
    })
}) 