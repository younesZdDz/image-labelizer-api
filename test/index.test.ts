// Require the dev-dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);

// Our parent block
describe('General API Health', () => {
    /*
     * Test the /GET Check OK status
     */

    describe('/GET Check OK status', () => {
        it('it should return OK', (done) => {
            done();
        });
    });

    /*
     * Test the /GET Not found
     */
    describe('/GET Not found', () => {
        it('it should return not found', (done) => {
            done();
        });
    });
});
