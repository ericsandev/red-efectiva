import React, { useEffect, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import { FaFilter } from 'react-icons/fa';

interface Post {
	userId: number;
	id: number;
	title: string;
	body: string;
}

function Grid() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
	const [userIdFilter, setUserIdFilter] = useState<string>('');
	const [bodyFilter, setBodyFilter] = useState<string>('');
	const [sortDirection, setSortDirection] = useState<string>('asc');

	useEffect(() => {
		fetch('https://jsonplaceholder.typicode.com/posts')
			.then((response) => response.json())
			.then((data) => {
				setPosts(data);
				setFilteredPosts(data);
			});
	}, []);

	const uppercaseFirstLetter = (value: string) => {
		return value.charAt(0).toUpperCase() + value.slice(1);
	};
	const handleUserIdFilterChange = (event: any) => {
		const { value } = event.target;
		setUserIdFilter(value);

		const filtered = posts.filter(
			(post) => post.userId.toString() === value
		);
		setFilteredPosts(filtered);
	};

	const handleUserIdInputBlur = () => {
		if (filteredPosts.length === 0) {
			setFilteredPosts(posts);
			setUserIdFilter('');
		}
	};

	const handleBodyFilterChange = (event: any) => {
		const { value } = event.target;
		setBodyFilter(value);

		const filtered = posts.filter((post) =>
			post.body.toLowerCase().includes(value.toLowerCase())
		);

		setFilteredPosts(filtered);
	};

	const handleSort = () => {
		const sorted = [...filteredPosts].sort((a, b) => {
			if (sortDirection === 'asc') {
				return a.title.localeCompare(b.title);
			} else {
				return b.title.localeCompare(a.title);
			}
		});

		setFilteredPosts(sorted);
		setSortDirection((prevDirection) =>
			prevDirection === 'asc' ? 'desc' : 'asc'
		);
	};

	return (
		<Container>
			<h1 className="my-4">Posts</h1>
			<Row
				md={4}
				className="justify-content-start text-left align-items-center my-4">
				<Col>
					<label>
						<FaFilter /> ID:
					</label>
					<input
						type="number"
						value={userIdFilter}
						onChange={handleUserIdFilterChange}
						onBlur={handleUserIdInputBlur}
					/>
				</Col>
				<Col>
					<label>
						<FaFilter /> Body:
					</label>
					<input
						type="text"
						value={bodyFilter}
						onChange={handleBodyFilterChange}
					/>
				</Col>
				<Col>
					<Button
						onClick={handleSort}
						style={{
							backgroundColor: '#000',
							color: '#fff',
							border: 'none',
							borderRadius: '0',
							width: '100%',
						}}>
						<FaFilter /> Sort by Title
					</Button>
				</Col>
			</Row>
			<Row md={4}>
				{filteredPosts.length > 0 ? (
					filteredPosts.map((post) => (
						<Col className="mb-4">
							<Card key={post.id} style={{ height: '100%' }}>
								<Card.Body>
									<Card.Title>
										<span
											style={{
												fontSize: '15px',
												backgroundColor: '#5C469C',
												color: '#ffffff',
											}}
											className="rounded rounded-full px-2 py-1">
											{post.userId}
										</span>{' '}
										| {uppercaseFirstLetter(post.title)}
									</Card.Title>
									<Card.Text>
										{React.createElement('span', {
											dangerouslySetInnerHTML: {
												__html: uppercaseFirstLetter(
													post.body.replace(
														new RegExp(
															bodyFilter,
															'gi'
														),
														(match: string) =>
															`<span style="background-color: #fc0">${match}</span>`
													)
												),
											},
										})}
									</Card.Text>
								</Card.Body>
							</Card>
						</Col>
					))
				) : (
					<p>No se encontraon resultados</p>
				)}
			</Row>
		</Container>
	);
}

export default Grid;
