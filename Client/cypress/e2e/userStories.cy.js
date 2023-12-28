import { MAIN_ROUTES } from "../../src/GlobalConstants/globalConstants"

const TEST_USER = {
  firstname : "TestUser_firstname",
  lastname : "TestUser_lastname",
  username: "TestUser_username",
  email : "testuser123@gmail.com",
  password : "@Testuser123"
}

describe('userStories tests', () => {

  beforeEach(() => {
    cy.visit(MAIN_ROUTES.HOME)
  })

  it('User can add a new post', async () => {

    let old_postsWritten
    let newComment_content = "This is a new post"

    // 1) User goes to log-in page
    cy.findByRole("button" , {name : /login/i}).click()

    // 2) User log-in 
    cy.findByRole('textbox').type(TEST_USER.email)
    cy.findByPlaceholderText(/password \*: maxblagun123@mb/i).type(TEST_USER.password)
    cy.findByRole('button', {  name: /sign in/i}).click()
    
    // 3) User go to his profile page and checks his amount of posts written
    cy.findByRole('heading', {
      name: TEST_USER.username,
      level: 3}).click()
    
    cy.get(`[data-cy="postsWritten"]`)
      .then($posts => old_postsWritten = $posts.text())

    
    // 4) User go back to comment section page and write new post
    cy.findByRole('heading', {
      name: /comment section/i
    }).click()

    cy.get(`[data-cy="skeleton-load-postContainer"]`).should('not.exist')
    
    cy.findByPlaceholderText(/Add A Comment.../i)
      .type(newComment_content)
  
    // 5) User clicks on send 
    cy.findByRole('button', {
      name: /send/i
    }).click()

    // 6) User sees his new post
    cy.findByText(newComment_content).should('be.visible')

    // 7) User go to his profile page again and checks his amount of posts written
    cy.findByRole('heading', {
      name: TEST_USER.username,
      level: 3}).click()
    
    cy.get(`[data-cy="postsWritten"]`)
      .then($posts => $posts === old_postsWritten + 1)


    // 8) User go to his posts history and see his new written post on page 1
    cy.findByRole('button', {
      name: /post history/i
    }).click()

    cy.findByText(newComment_content).should('be.visible')
  })
})