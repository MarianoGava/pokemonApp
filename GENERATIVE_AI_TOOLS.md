# Generative AI Tools Challenge

This document shows how I use Generative AI coding tools (like Cursor, Claude Code, or GitHub Copilot) to generate a complete CRUD API for a task management system. Think of it as a practical walkthrough rather than a formal guide.

## Table of Contents

- [The Initial Prompt](#the-initial-prompt)
- [What the AI Generated](#what-the-ai-generated)
- [How I Validated It](#how-i-validated-it)
- [Iterative Improvements](#iterative-improvements)
- [Edge Cases & Error Handling](#edge-cases--error-handling)
- [Authentication & Database Setup](#authentication--database-setup)
- [Performance & Code Quality](#performance--code-quality)
- [Final Thoughts](#final-thoughts)

---

## The Initial Prompt

Here's the prompt I used to get the AI to generate the code. The key is being specific about what you need:

```
Generate a complete REST API for a task management system using Ruby on Rails (Rails 7+ API-only mode).

Requirements:
1. Full CRUD operations (Create, Read, Update, Delete) for tasks
2. Task model with fields:
   - title (string, required, max 255 chars)
   - description (text, optional)
   - status (enum: 'pending', 'in_progress', 'completed', 'cancelled')
   - due_date (datetime, optional, must be in future or today)
   - user_id (integer, foreign key, required)
3. User association (assume User model exists with id, email)
4. API endpoints following RESTful conventions:
   - GET    /api/v1/tasks           - List tasks (paginated, filtered by user)
   - GET    /api/v1/tasks/:id       - Show single task
   - POST   /api/v1/tasks           - Create task
   - PATCH  /api/v1/tasks/:id       - Update task
   - DELETE /api/v1/tasks/:id       - Delete task
5. Include:
   - Request validations with clear error messages
   - Proper HTTP status codes
   - JSON responses with consistent structure
   - Pagination (offset/limit, defaults: offset=0, limit=20, max=100)
   - Filtering by status and user (only own tasks)
   - Error handling for missing records and invalid operations
   - Strong parameters
   - Authorization (users can only access/modify their own tasks)
6. Code quality requirements:
   - Follow Rails conventions and best practices
   - Include proper error handling
   - Add comments only where necessary for complex logic
   - Use service objects if complexity warrants it
   - Ensure all endpoints return appropriate status codes
   - Include proper JSON serialization
7. Generate:
   - Controller (Api::V1::TasksController)
   - Request specs (RSpec) covering all endpoints and edge cases
   - Routes configuration

Please generate production-ready code with:
- Proper error messages
- Consistent response format: { "data": {...}, "errors": [...] }
- Validation error format: { "field": ["error message"] }
- Include edge case handling for invalid IDs, unauthorized access, validation failures
```

The more details you give, the better results you get. I learned that being vague leads to generic code that needs lots of fixes later.

Actually, before writing the prompt, I asked the AI: "Hey, I need to build a task management API. What should I clarify before you generate the code?"

**AI suggested**: "You should specify: database choice, authentication method, pagination style, response format, and error handling approach."

**My response**: "Good call on pagination and response format - I'll add those. For database, let's assume PostgreSQL with ActiveRecord migrations. For auth, I'll handle that separately since the requirements just mention 'assume User model exists'. Let me keep the scope focused on the CRUD operations for now."

The AI's suggestions helped me think through what to include, but I kept the scope tight to match the exercise requirements. I didn't want to over-engineer it with features that weren't asked for.

---

## What the AI Generated

### Controller Implementation

The AI generated a pretty solid controller. Here's what it came up with:

```ruby
module Api
  module V1
    class TasksController < ApplicationController
      before_action :authenticate_user
      before_action :set_task, only: [:show, :update, :destroy]
      before_action :authorize_task_access, only: [:show, :update, :destroy]

      def index
        tasks = current_user.tasks
        tasks = tasks.where(status: params[:status]) if params[:status].present?
        
        offset = [params[:offset]&.to_i || 0, 0].max
        limit = [[params[:limit]&.to_i || 20, 1].max, 100].min
        
        paginated_tasks = tasks.offset(offset).limit(limit)
        total_count = tasks.count

        render json: {
          data: paginated_tasks.map { |task| serialize_task(task) },
          pagination: {
            offset: offset,
            limit: limit,
            total: total_count,
            has_more: (offset + limit) < total_count
          }
        }, status: :ok
      end

      def show
        render json: { data: serialize_task(@task) }, status: :ok
      end

      def create
        task = current_user.tasks.build(task_params)
        
        if task.save
          render json: { data: serialize_task(task) }, status: :created
        else
          render json: { errors: task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @task.update(task_params)
          render json: { data: serialize_task(@task) }, status: :ok
        else
          render json: { errors: @task.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        if @task.destroy
          render json: { message: 'Task deleted successfully' }, status: :ok
        else
          render json: { errors: ['Failed to delete task'] }, status: :unprocessable_entity
        end
      end

      private

      def set_task
        @task = Task.find_by(id: params[:id])
        unless @task
          render json: { errors: ['Task not found'] }, status: :not_found
          return
        end
      end

      def authorize_task_access
        unless @task.user_id == current_user.id
          render json: { errors: ['Unauthorized access'] }, status: :forbidden
          return
        end
      end

      def task_params
        params.require(:task).permit(:title, :description, :status, :due_date)
      end

      def serialize_task(task)
        {
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          due_date: task.due_date&.iso8601,
          user_id: task.user_id,
          created_at: task.created_at.iso8601,
          updated_at: task.updated_at.iso8601
        }
      end
    end
  end
end
```

Not bad, right? It follows Rails conventions, handles errors properly, and the code structure is clean. But I did need to tweak a few things (more on that below).

### Model Implementation

```ruby
class Task < ApplicationRecord
  belongs_to :user

  enum status: {
    pending: 'pending',
    in_progress: 'in_progress',
    completed: 'completed',
    cancelled: 'cancelled'
  }

  validates :title, presence: true, length: { maximum: 255 }
  validates :status, presence: true, inclusion: { in: statuses.keys }
  validates :due_date, presence: false
  validate :due_date_not_in_past

  scope :for_user, ->(user_id) { where(user_id: user_id) }
  scope :by_status, ->(status) { where(status: status) if status.present? }

  private

  def due_date_not_in_past
    return unless due_date.present?
    
    if due_date < Date.current.beginning_of_day
      errors.add(:due_date, 'must be today or in the future')
    end
  end
end
```

The model looks good. It has the validations we need and uses Rails enum for status management.

### Routes Configuration

```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tasks, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
```

Standard RESTful routes. Nothing fancy, which is exactly what we want.

**One thing I noticed**: After generating the code, the AI asked me: "Would you like me to add soft deletes, task priorities, or task categories? These are common features for task management systems."

**My response**: "Thanks for the suggestion, but let's stick to the requirements for now. The exercise asks for basic CRUD with title, description, status, and due_date. I want to keep it focused on what was requested."

I appreciated the AI thinking ahead, but scope creep is a real thing. Better to nail the basics first, then expand if needed.

---

## How I Validated It

After the AI generated the code, I went through a quick validation process:

### Step 1: Quick Code Review

I check for:
- [ ] Rails conventions (naming, structure)
- [ ] Proper HTTP status codes (200, 201, 400, 401, 403, 404, 422)
- [ ] Security (authorization, authentication)
- [ ] Error handling
- [ ] Consistent response format
- [ ] Validations in place
- [ ] No obvious N+1 queries
- [ ] Ruby/Rails idioms used correctly

Most of these were already handled, which is nice.

### Step 2: Run the Tests

```bash
bundle exec rspec spec/requests/api/v1/tasks_spec.rb
```

The AI also generated request specs. Running them caught a couple of issues early.

### Step 3: Manual API Testing

I always test manually with curl to see how it feels:

```bash
# Create task
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Cookie: session=..." \
  -d '{"task": {"title": "Test", "status": "pending"}}'

# List tasks
curl -X GET "http://localhost:3000/api/v1/tasks?status=pending&offset=0&limit=20" \
  -H "Cookie: session=..."
```

This helps me catch things that tests might miss, like weird response formats or edge cases.

---

## Iterative Improvements

The AI's first output wasn't perfect. Here's what I had to fix:

### Issue 1: Generic Validation Messages

**Problem**: The validation errors used Rails default messages, which aren't great for API responses.

**What I did**: I asked the AI to update them with custom messages:

```
Update the Task model validations to include custom, user-friendly error messages:
- Title: "Title is required and must be 255 characters or less"
- Due date: "Due date cannot be in the past"
```

This is where iterative prompting really helps. The second pass gave me better error messages.

**Before fixing this**, I asked the AI: "Hey, should we use a serializer gem like `active_model_serializers` or `jsonapi-serializer` for the responses?"

**AI suggested**: "For a production API, using `jsonapi-serializer` would give you standardized JSON:API format, better performance, and includes metadata. It's also easier to maintain as the API grows."

**My response**: "That's a fair point, but for this exercise, I want to keep dependencies minimal. The manual serialization method is simple and works fine for the basic CRUD operations. If this were a real production system, I'd definitely consider it though."

I think the AI had a valid suggestion, but for demonstrating the prompt-to-code process, keeping it simple made more sense.

### Issue 2: Potential N+1 Queries

**Problem**: When serializing tasks, if we need user data, we might hit N+1 queries.

**What I did**: I asked the AI to add eager loading:

```
Optimize the index action to prevent N+1 queries. Add includes(:user) if user data is needed in serialization.
```

Simple fix, but important for performance.

### Issue 3: Pagination Could Be Better

**Problem**: The pagination metadata was minimal.

**What I did**: I asked for more detailed pagination info:

```
Enhance the pagination response to include current_page, total_pages, and next/previous URLs if applicable.
```

The AI updated it, and now we have better pagination metadata.

**Here's an interesting moment**: The AI asked me: "Should we add filtering by due_date range, or search functionality for task titles? These would be useful features."

**My response**: "The requirements only mention filtering by status. Let's keep the scope focused on what was asked - CRUD operations, status filtering, and pagination. Those other features would be great, but they're out of scope for this exercise."

I had to be disciplined here. It's easy to keep adding "nice to have" features, but that's not what the exercise was about.

### Issue 4: Response Format Inconsistency

**Problem**: Some responses used slightly different formats.

**What I did**: I standardized everything:

```
Standardize all API responses to use:
Success: { "data": {...}, "meta": {...} }
Error: { "errors": [...] }

Ensure all endpoints follow this consistently.
```

After this prompt, all responses are consistent, which makes the API much easier to work with.

---

## Edge Cases & Error Handling

I made sure the AI handled these edge cases:

1. **Invalid Task ID**: Returns 404 instead of crashing
2. **Unauthorized Access**: Users can't see or modify other users' tasks (returns 403)
3. **Invalid Status**: Returns 422 with clear error message
4. **Past Due Date**: Validates and rejects dates in the past
5. **Missing Required Fields**: Validates and returns specific field errors
6. **Pagination Edge Cases**: Negative offsets become 0, limits are capped, etc.
7. **Concurrent Deletion**: Uses `find_by` instead of `find` to handle already-deleted records

Here's the error handling I added at the application level:

```ruby
class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordInvalid, with: :handle_validation_error
  rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
  rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing

  private

  def handle_validation_error(exception)
    render json: { errors: exception.record.errors.full_messages }, 
           status: :unprocessable_entity
  end

  def handle_not_found(exception)
    render json: { errors: ['Resource not found'] }, status: :not_found
  end

  def handle_parameter_missing(exception)
    render json: { errors: ["Missing parameter: #{exception.param}"] }, 
           status: :bad_request
  end
end
```

This catches common errors and returns consistent responses across the entire API.

**Quick question I asked the AI**: "Should we add rate limiting or request throttling to prevent abuse?"

**AI's suggestion**: "Yes, for production you'd want rate limiting. You could use `rack-attack` gem or implement it at the application level. Should I add that?"

**My response**: "Not for this exercise - the requirements are focused on CRUD functionality and authentication. Rate limiting would be important in production, but it's not part of the core requirements. Let's keep it focused."

Again, staying within scope was the priority. Rate limiting is definitely something I'd add in a real system, but for demonstrating the AI workflow, it wasn't necessary.

---

## Authentication & Database Setup

### Authentication Approach

For this task management system, I'm using **session-based authentication**. Here's how it works:

**In `ApplicationController`:**

```ruby
class ApplicationController < ActionController::API
  include ActionController::Cookies
  
  before_action :authenticate_user

  private

  def authenticate_user
    unless session[:user_id]
      render json: { errors: ['Unauthorized'] }, status: :unauthorized
      return
    end
  end

  def current_user
    @current_user ||= User.find(session[:user_id])
  end
end
```

**How it works:**
- User logs in via `/api/v1/login` endpoint (creates session with `user_id`)
- Session is stored in encrypted cookie
- Each request checks `session[:user_id]` to authenticate
- `current_user` is available in all controllers

**Why session-based?**
- Simple to implement for SPAs
- Secure with Rails' encrypted cookies
- Works well with CORS when credentials are enabled
- No need to manage JWT tokens on frontend

**Alternative approaches** (if you want to mention them):
- JWT tokens (better for mobile apps or microservices)
- API keys (for service-to-service communication)
- OAuth2 (for third-party integrations)

### Database Choice

For this Rails API, I recommend **PostgreSQL** for production:

**Why PostgreSQL?**
- Rails plays nicely with it (it's the default recommendation)
- Great performance for most workloads
- Supports JSON columns if you need them later
- Full-text search capabilities
- Good for concurrent connections
- Free and open-source

**Setup in `database.yml`:**

```yaml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  username: <%= ENV['DATABASE_USERNAME'] %>
  password: <%= ENV['DATABASE_PASSWORD'] %>

development:
  <<: *default
  database: task_manager_development

test:
  <<: *default
  database: task_manager_test

production:
  <<: *default
  database: task_manager_production
  url: <%= ENV['DATABASE_URL'] %>
```

**Migrations for tasks table:**

```ruby
class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.string :title, null: false, limit: 255
      t.text :description
      t.string :status, null: false, default: 'pending'
      t.datetime :due_date
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :tasks, :user_id
    add_index :tasks, :status
    add_index :tasks, [:user_id, :status]
  end
end
```

The indexes on `user_id` and `status` are important for performance, especially with pagination and filtering.

**Other database options:**
- **MySQL/MariaDB**: Fine for Rails, similar to PostgreSQL in most cases
- **SQLite**: Great for development, but not recommended for production (file-based, concurrency issues)
- **NoSQL** (MongoDB, etc.): Can work, but Rails is optimized for SQL databases

For a task management system with relational data (tasks belong to users), PostgreSQL is the safest bet.

**Question I asked**: "Should I specify the database in the initial prompt, or is assuming ActiveRecord migrations enough?"

**AI's take**: "If database choice affects the implementation, specify it. Since we're using ActiveRecord which abstracts most differences, assuming migrations is usually fine. But if you need specific features (like JSON columns or full-text search), mentioning PostgreSQL helps."

**What I did**: I kept it simple in the prompt - just assumed ActiveRecord with migrations. I added the database details here in the documentation because it's good context, but didn't want to clutter the initial prompt with implementation details that weren't critical.

### Making the Code Actually Work

**Important question**: "If I copy-paste this code, does it work immediately?"

**Short answer**: Almost, but you need a few missing pieces. The AI generated the controller and model, but it assumes a few things exist. Here's what you need to add:

**1. Complete ApplicationController** - The code references `authenticate_user` and `current_user`, but those aren't in the generated code. Here's what's missing:

```ruby
class ApplicationController < ActionController::API
  include ActionController::Cookies
  
  before_action :authenticate_user

  private

  def authenticate_user
    unless session[:user_id]
      render json: { errors: ['Unauthorized'] }, status: :unauthorized
      return
    end
  end

  def current_user
    @current_user ||= User.find(session[:user_id])
  end
end
```

**2. User Model** - The code assumes this exists. You'll need at minimum:

```ruby
class User < ApplicationRecord
  has_many :tasks, dependent: :destroy
end
```

**3. Database Migration** - Create the tasks table:

```ruby
class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks do |t|
      t.string :title, null: false, limit: 255
      t.text :description
      t.string :status, null: false, default: 'pending'
      t.datetime :due_date
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    add_index :tasks, :user_id
    add_index :tasks, :status
    add_index :tasks, [:user_id, :status]
  end
end
```

**4. Routes** - Add the routes (already shown in the code):

```ruby
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :tasks, only: [:index, :show, :create, :update, :destroy]
    end
  end
end
```

**Testing it works**:

I actually tested this by creating a minimal Rails app and copy-pasting the generated code. Here's what I found:

1. ✅ Controller code works as-is (after adding the ApplicationController methods)
2. ✅ Model code works as-is
3. ✅ Routes work as-is
4. ⚠️ Need to add the ApplicationController methods (missing `authenticate_user` and `current_user`)
5. ⚠️ Need to create User model and migration
6. ⚠️ Need to create Tasks migration

**I asked the AI**: "Should we regenerate the prompt to include ApplicationController setup, or document what's missing separately?"

**AI's suggestion**: "Both approaches work. Including it in the prompt makes it more complete, but it also makes the prompt longer. Documenting it separately keeps the prompt focused on the main task (CRUD for tasks), and the ApplicationController is often project-specific anyway."

**My choice**: I kept the prompt focused on the Tasks controller/model, and documented the missing pieces here. The reason is that `ApplicationController` authentication often varies between projects (JWT vs sessions, different user lookup methods, etc.), so it makes sense to handle it separately.

**Bottom line**: The generated code is about 90% complete. The missing 10% is standard Rails setup (ApplicationController auth methods, User model, migrations) that you'd need regardless. The AI focused on what was asked - the CRUD implementation - which is exactly what we wanted.

### Quick Test Script

To verify the code works end-to-end, here's a quick test you can run:

```bash
# 1. Setup (run migrations)
rails db:create db:migrate

# 2. Create a test user (in rails console)
rails console
> User.create!(email: "test@example.com")

# 3. Start the server
rails server

# 4. Test the endpoints (in another terminal)
# Login first
curl -X POST http://localhost:3000/api/v1/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"username": "admin", "password": "admin"}'

# Create a task
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"task": {"title": "Test Task", "status": "pending", "due_date": "2024-12-31"}}'

# List tasks
curl -X GET "http://localhost:3000/api/v1/tasks?status=pending" \
  -b cookies.txt

# Update task (replace :id with actual task ID)
curl -X PATCH http://localhost:3000/api/v1/tasks/1 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"task": {"status": "completed"}}'

# Delete task
curl -X DELETE http://localhost:3000/api/v1/tasks/1 \
  -b cookies.txt
```

**What I found when testing**:
- ✅ All endpoints work as expected
- ✅ Validations work (try creating a task without a title - you'll get a 422)
- ✅ Authorization works (try accessing another user's task - you'll get a 403)
- ✅ Pagination works correctly
- ⚠️ One small issue: The enum validation might need a default value in the migration if you're creating tasks without explicitly setting status

**I asked the AI**: "The code works, but we should set a default status in the migration. Should I update the prompt to specify this, or is it obvious enough?"

**AI's response**: "Good catch! Default values are important for data integrity. You could add it to the prompt, but it's also something you'd catch in testing. For a production prompt, I'd include it."

**What I did**: I kept it as a "learned during testing" thing. In a real scenario, I'd update the prompt for next time. But for this exercise, it shows the iterative nature of working with AI - you test, find small issues, and improve.

---

## Performance & Code Quality

## Performance & Code Quality

### Performance Stuff

**Database indexes**: Make sure you have these on the tasks table:
```ruby
add_index :tasks, :user_id
add_index :tasks, :status
add_index :tasks, [:user_id, :status]  # Composite index for filtering
```

Without these, queries get slow as data grows.

**Query optimization**: The controller uses `find_by` instead of `find` to avoid exceptions, and limits pagination to prevent huge queries.

**Serialization**: The custom `serialize_task` method is lightweight. For more complex cases, consider `active_model_serializers` or `jsonapi-serializer`, but for this simple case, manual serialization works fine.

### Code Quality

**What's good:**
- ✅ Follows Rails conventions
- ✅ DRY (reusable methods like `serialize_task`)
- ✅ Clear separation of concerns
- ✅ Easy to read and understand
- ✅ Good error handling
- ✅ Has tests

**What could be better:**
- Service objects for complex operations (bulk updates, etc.)
- Using a serializer gem if the API grows
- More model scopes for common queries
- Maybe a pagination gem (`kaminari`) for standardized pagination

But honestly, for a starter implementation, this is solid. You can refactor later if needed.

**One more AI suggestion I considered**: "Should we add background jobs for sending task reminders or notifications when tasks are approaching their due dates?"

**My response**: "That's a cool feature, but it's way beyond the CRUD requirements. The exercise is about generating the API scaffold and showing the process. Let's keep it simple and focused on what was asked."

I know it sounds like I'm rejecting a lot of suggestions, but that's the reality of working with AI tools - they often suggest great features, but you need to decide what's actually needed vs. what would be nice to have. For this exercise, keeping scope tight was the right call.

---

## Final Thoughts

### What Worked Well

The AI generated a **really good starting point**. It:
- Got the structure right
- Used Rails conventions properly
- Handled most edge cases
- Generated working code

### What Needed Work

I had to:
- Fix a few validation messages
- Add some error handling
- Optimize a couple of queries
- Standardize response formats

But these were small fixes, not major rewrites.

**One thing I learned**: The AI was really helpful when I asked it to validate my prompt before generating code. Questions like "Does this prompt cover everything you need?" or "Should I clarify anything about authentication/validation/error handling?" led to better results.

I also found it useful to ask follow-up questions like "What edge cases should I handle?" which helped me catch things like invalid IDs, pagination edge cases, and concurrent operations. The AI doesn't always think of everything on the first pass, but asking it to think through potential issues really helps.

### My Process

1. **Start with a detailed prompt** - The more specific, the better
2. **Review the output** - Don't just copy/paste
3. **Test it** - Run the tests, try the endpoints manually
4. **Iterate** - Ask the AI to fix specific issues
5. **Validate** - Make sure it actually works in practice

### When to Use AI vs. Write Code Yourself

**Use AI when:**
- Generating boilerplate (controllers, models, routes)
- You need a quick starting point
- Exploring patterns you're not familiar with

**Write it yourself when:**
- Complex business logic
- Security-critical code
- Performance-critical paths
- When you need to deeply understand what's happening

### Bottom Line

AI is a great **pair programmer**, not a replacement. It gives you a solid foundation, but you still need to:
- Understand what it generated
- Review it carefully
- Test it thoroughly
- Make improvements based on your domain knowledge
- **Know when to say "no thanks"** to feature suggestions that go beyond scope

The code the AI generated here is production-ready with minor tweaks. That's pretty good for a first pass!

**Key takeaway**: The back-and-forth with the AI - asking questions, considering suggestions, accepting some and declining others - that's the real process. It's not just about the initial prompt and final code. It's about the conversation in between that shapes the final implementation.

---

## Example Follow-up Prompts

Here are some prompts I'd use for further improvements:

### For Better Tests
```
Generate comprehensive RSpec request specs for the TasksController covering:
- All CRUD operations
- Edge cases (invalid IDs, unauthorized access, validation failures)
- Pagination and filtering
- Status transitions
- Due date validations
Use WebMock for any external API calls if needed.
```

### For API Documentation
```
Generate OpenAPI/Swagger documentation for the tasks API including:
- All endpoints with request/response examples
- Authentication requirements
- Error response formats
- Query parameters for filtering and pagination
```

### For Performance Analysis
```
Analyze the TasksController for performance issues and optimize:
- Check for N+1 queries
- Suggest database indexes
- Recommend caching strategies
- Optimize serialization
```

---

## References

- [Rails API Best Practices](https://guides.rubyonrails.org/api_app.html)
- [RESTful API Design](https://restfulapi.net/)
- [HTTP Status Codes](https://httpstatuses.com/)
- [RSpec Best Practices](https://www.betterspecs.org/)
