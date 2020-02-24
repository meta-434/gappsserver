const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
    it('should return unfiltered app list when not passed any params', () => {
        // easier to check that lists are sorted than to check that they're not sorted
        return supertest(app)
            .get('/apps')
            .query({})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);
                const app1 = res.body[0];

                expect(app1).to.include.all.keys(
                    'App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating',
                    'Genres', 'Last Updated', 'Current Ver', 'Android Ver'
                );
            })
    });

    it('Should throw error on bad genre filter term', () => {
       return supertest(app)
           .get('/apps')
           .query({genres : 'badGenre'})
           .expect(400, 'genre must be one of: Action, Puzzle, Strategy, Casual, Arcade, Card, instead got badGenre');
    });

    it('Should filter results on good filter term', () => {
        return supertest(app)
            .get('/apps')
            .query({genres: 'Action'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);

                const howMany = res.length;
                for (let i = 0; i < Math.ceil(howMany / 2); i++) {
                    let idx = Math.floor(Math.random() * howMany) - 1;
                    expect(res.body[idx].Genres).to.be('Action');
                }
            });
    });

    it('Should filter AND SORT results on good filter term AND SORT PARAM', () => {
        return supertest(app)
            .get('/apps')
            .query({genres: 'Action', sort: 'rating'})
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1);

                const howMany = res.length;
                for (let i = 0; i < Math.ceil(howMany / 2); i++) {
                    let idx = Math.floor(Math.random() * howMany) - 1;
                    expect(res.body[idx].Genres).to.be('Action');
                }

                for (let j = 0; j < howMany; j ++) {
                    let hold = res.body[0].Rating;
                    expect(res.body[j].Rating).to.be.toBeLessThanOrEqual(hold);
                    hold = res.body[j].Rating;
                }
            });
    });
});