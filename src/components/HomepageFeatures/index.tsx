import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
    title: string;
    Svg: React.ComponentType<React.ComponentProps<'svg'>>;
    description: ReactNode;
};

const FeatureList: FeatureItem[] = [
    {
        title: '',
        Svg: require('@site/static/img/su-rocket.svg').default,
        description: (
            <>
            </>
        ),
    },
    {
        title: 'FHIR API',
        Svg: require('@site/static/img/fhir-logo.svg').default,
        description: (
            <>
                Spreekuur.nl FHIR API documentation to integrate with XIS's.
            </>
        ),
    },
    {
        title: '',
        Svg: require('@site/static/img/su-hand.svg').default,
        description: (
            <>
            </>
        ),
    },
];

function Feature({title, Svg, description}: FeatureItem) {
    return (
        <div className={clsx('col col--4')}>
            <div className="text--center">
                <Svg className={styles.featureSvg} role="img"/>
            </div>
            <div className="text--center padding-horiz--md">
                <Heading as="h3">{title}</Heading>
                <p>{description}</p>
            </div>
        </div>
    );
}

export default function HomepageFeatures(): ReactNode {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}
