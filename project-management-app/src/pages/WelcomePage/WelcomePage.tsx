import { Container, Box } from '@mui/material';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <Box sx={{ paddingTop: '40px' }}>
      <Container>
        <section className="description">
          <h2 className="description__text">PMA - application for making a list of tasks</h2>
          <p className="description__text">
            Start with a Trello board, lists, and cards. Customize and expand with more features as
            your teamwork grows.
          </p>
        </section>
        <section className="description team">
          <div className="description__container">
            <h2 className="description__title">About the team</h2>
            <div className="team__item">
              <div className="team__photo elena"></div>
              <div className="team__description">
                <h3 className="description__subtitle">
                  Aliaksei Hurban <span>team lead, developer</span>
                </h3>
                <p className="description__text">
                  Designed the architecture of the application, the layout of the application, as
                  well as the registration form, and tried to make interaction with cards
                </p>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Box>
  );
};

export { WelcomePage };
