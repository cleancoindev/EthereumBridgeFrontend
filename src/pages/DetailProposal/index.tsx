import ProposalLayout from 'components/ProposalLayout'
import VoteModal from 'components/VoteModal'
import moment from 'moment';
import React, { useEffect } from 'react'
import { observer } from 'mobx-react'
import { useParams } from 'react-router'
import { Button } from 'semantic-ui-react'
import { useStores } from 'stores'
import './style.scss';

export const DetailProposal = observer((props) => {

    const { theme, user } = useStores();
    // console.log('Proposals:', user.proposals);

    const { id }: any = useParams();
    // console.log(useParams());

    const [proposal, setProposal] = React.useState({
        id: '',
        address: '',
        title: '',
        description: '',
        vote_type: '',
        author_address: '',
        author_alias: '',
        end_date: 0,
        ended: false,
        valid: false,
        status: ''
    });

    const [userResult, setUserResult] = React.useState({
        choice: 0,
        voting_power: ''
    });

    const [choice, setChoice] = React.useState('')

    // console.log(user.getTally(proposal.address));

    const getProposal = (id: string) => {
        const proposal = user.proposals?.find(ele => ele?.id == id);
        // console.log(proposal);
        if (proposal) {
            setProposal(proposal);
        }
    }

    const getUserResponse = async () => {
        try {
            const result = await user.getUserVote(proposal?.address)
            setUserResult(result);
        } catch (err) {
            console.log(err.message);
        }
    }

    const transformChoice = (choiceSelected: number) => {

        choiceSelected === 0 ? setChoice('No') : ('Yes')

    }

    // console.log('Addresss:', proposal.address);
    // console.log('Author Adrress:', proposal.author_address);

    const getAtuhorAddress = (): string => {
        if (proposal.author_address) {
            return (proposal?.author_address?.substring(0, 10) + '...' + proposal?.author_address?.substring(proposal?.author_address?.length - 3, proposal?.author_address?.length));
        } else {
            return '';
        }
    }

    const transformProposalType = (): string => {
        if (proposal.vote_type) {
            let voteType;
            switch (proposal.vote_type) {
                case '1': voteType = 'SEFI Rewards Pool'; break;
                case '2': voteType = 'SEFI Community Spending'; break;
                case '3': voteType = 'SecretSwap Parameter Change'; break;
                case '4': voteType = 'Other'; break;
            }
            return voteType
        } else {
            return '';
        }
    }

    useEffect(() => {
        getUserResponse();
    }, [user.getUserVote(proposal?.address)]);


    useEffect(() => {
        getProposal(id);
        transformChoice(userResult.choice);

    }, [user.proposals]);

    return (
        <ProposalLayout>
            <>
                <div className="proposal-container">

                    <div className={`proposal-detail ${theme.currentTheme}`}>
                        <div className='vote-row'>
                            <div className='proposal-id'>
                                <p>#{proposal.id}</p>
                            </div>
                        </div>
                        <div className='proposal-content'>
                            <div className='title'>
                                <h3>{proposal.title}</h3>
                            </div>
                            {/* <div className="proposal-address">
                                <p>Porposal Address: </p> <p>{proposal.author_address}</p>
                            </div> */}
                            <div className='description'>
                                <h5>Description</h5>
                                <p>{proposal.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className={`cards ${theme.currentTheme}`}>
                        <div className="card card-info">
                            <div className="card-title"><h5>Information</h5></div>
                            <div className="card-row">
                                <div className="label"><p>Status</p></div>
                                <div className={`proposal-status small status-${proposal.status}`}>
                                    {proposal.status}
                                </div>
                            </div>
                            <div className="card-row">
                                <div className="label"><p>Type</p></div>
                                <div className="title"><p>{transformProposalType()}</p></div>
                            </div>
                            <div className="card-row">
                                <div className="label"><p>Proposed by</p></div>
                                <div className="user-info">
                                    <div className="title"><p>{proposal.author_alias}</p></div>
                                    <div className="address"><p>{getAtuhorAddress()}</p></div>
                                </div>
                            </div>
                            <div className="user-response">
                                <div className="voting-power">
                                    <div><h3>{userResult.voting_power} SEFI</h3></div>
                                    <div className="label"><p>My Voting Power</p></div>
                                </div>
                                <div className="vote-response">
                                    <div><h3>{choice}</h3></div>
                                    <div className="label"><p>My Vote</p></div>
                                </div>
                            </div>
                            <VoteModal
                                id={proposal.id}
                                title={proposal.title}
                                address={proposal.address}
                            >
                                <Button
                                    className='button-vote g-button'
                                >Vote
                                </Button>
                            </VoteModal>
                        </div>

                        <div className="card card-results">

                            <h5 className="card-title">Results</h5>
                            <p className="description">Results will be available when voting ends.</p>

                            <div className="endTime">
                                <div className="label"><p>Voting End Time</p></div>
                                <div className="title">
                                    <p>{moment(props.end_date).format('ddd D MMM, HH:mm')}</p>
                                </div>
                            </div>

                            <div className="closed-proposal">
                                <div className="voted">
                                    <div><h3>78%</h3></div>
                                    <div className="label"><p>Voted</p></div>
                                </div>
                                <div className="result">
                                    <div><h3>67%</h3></div>
                                    <div className="label"><p>Yes</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>


        </ProposalLayout>
    )
})