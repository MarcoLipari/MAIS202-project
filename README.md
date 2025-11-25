
# Reddit Comment Year Classification

## Problem statement
This project aims to develop a machine learning model capable of estimating the time period during which a Reddit comment was written, based solely on its text.

Reddit language evolves dramatically over time. Slang, memes, tone, formatting, punctuation patterns, and cultural references all change year to year. This model will be able to predit the date a redit comment belongs to based on its linguistic features.


## Data

- We used the publicly available Reddit monthly comment dumps from June 2005 till December 2024 provided on Academic Torrents: [open an issue](https://academictorrents.com/details/ba051999301b109eab37d16f027b3f49ade2de13)
- We then used a bash script to clean the data into monthly CSV files

## Models and Approach

## Linear regression
- Large dataset needed foe accuracy.
- Long training time.
- Performance plateaued, not improving enough to justify continued training

## Multi-class Classification
- We used a multi-class classification model where every comment is assigned to a time interval (bin).
- Faster training
- Better accuracy
- Less sensitivity to noise
- Smaller dataset requirements


# Run the project
npm start
```

## Usage

```javascript
const myProject = require('my-project');
myProject.doSomethingAwesome();
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please [open an issue](https://github.com/yourusername/yourproject/issues).
