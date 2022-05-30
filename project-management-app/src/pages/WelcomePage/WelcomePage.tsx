import { Container, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './WelcomePage.css';

const WelcomePage = () => {
  const { t } = useTranslation();
  return (
    <Box sx={{ paddingTop: '40px' }}>
      <Container>
        <section className="description">
          <h2 className="description__text">{t('app_title')}</h2>
          <p className="description__text">{t('app_description')}</p>
        </section>
        <section className="description team">
          <div className="description__container">
            <h2 className="description__title">{t('about_the_team')}</h2>
            <div className="team__item">
              <div className="team__photo elena"></div>
              <div className="team__description">
                <h3 className="description__subtitle">
                  {t('name')} <span>{t('name_description')}</span>
                </h3>
                <p className="description__text">{t('name_work')}</p>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </Box>
  );
};

export { WelcomePage };
