const request = require("supertest");
const app = require("..");
const { clearDatabase } = require("../db.connection");

const req = request(app);




    fdescribe("users routes:", () => {
        
       
        afterAll(async () => {
            await clearDatabase()
        })
        beforeAll(async () => {

            let mockUser = { name: "mohamed", email: "mohamed@gmail.com", password: "126" };
            let res1 = await req.post("/user/signup").send(mockUser);
            
        })
        //case one 
        // Note: user name must be sent in req query not req params
        it("req to get(/user/search) ,expect to get the correct user with his name", async () => {
         let res = await req.get("/user/search").query({ name: 'mohamed' });
         expect(res.status).toBe(200);
         expect(res.body.data.name).toContain('mohamed')

         })
       //case two
        it("req to get(/search) with invalid name ,expect res status and res message to be as expected", async () => { 
            let res = await req.get("/user/search").query({ name: 'kholoud' });
         expect(res.status).toBe(200);
         expect(res.body.message).toContain('There is no user with name: kholoud')
         //or
        //  expect(res.body.message).toBe('There is no user with name: kholoud')

        })


        //case three
        it("req to delete(/) ,expect res status to be 200 and a message sent in res", async () => {
          let res = await req.delete("/user/");
          expect(res.status).toBe(200);
          expect(res.body.message).toContain("users have been deleted successfully")

         })
    })


    fdescribe("todos routes:", () => {
       
        let userInDb;
        let token;
        let token2;
       let todoinDb
       
        afterAll(async () => {
            await clearDatabase()
        })


        beforeAll(async () => {
            process.env.SECRET = "this-is-my-jwt-secret";
            let mockUser = { name: "mohamed", email: "mohamed@gmail.com", password: "126" };
            let res1 = await req.post("/user/signup").send(mockUser);
            userInDb = res1.body.data;
            let res2 = await req.post("/user/login").send(mockUser);
            token = res2.body.token;

            let mockUser2 = { name: "kholoud", email: "kholoudhanafy@.com", password: "146" };
            let res4 = await req.post("/user/signup").send(mockUser2);
            usernothavetodo = res4.body.data;
            let res5 = await req.post("/user/login").send(mockUser2);
            token2 = res5.body.token;



            let res3=await req.post('/todo/').send({title:'do Work'}).set({authorization:token})
            todoinDb=res3.body.data

          });
        it("req to patch(/) with id only ,expect res status and res message to be as expected", async () => {
          let res = await req.patch("/todo/"+todoinDb._id).set({authorization:token})
          expect(res.status).toBe(400);
          expect(res.body.message).toContain("must provide title and id to edit todo")
         })
        it("req to patch(/) with id and title ,expect res status and res to be as expected", async () => { 
            let res = await req.patch("/todo/"+todoinDb._id).send({title:'playing'}).set({authorization:token})
            expect(res.status).toBe(200);
            expect(res.body.data.title).toContain('playing')


        })

        it("req to get( /user) ,expect to get all user's todos", async () => { 
          let res = await req.get('/todo/user').set({authorization:token})
          expect(res.status).toBe(200);
        
        })
        it("req to get( /user) ,expect to not get any todos for user hasn't any todo", async () => {
            let res = await req.get('/todo/user').set({authorization:token2})
             expect(res.status).toBe(200);
           expect(res.body.message).toContain(`Couldn't find any todos for ` + usernothavetodo._id); 


         })
        
        

        
    })

    


