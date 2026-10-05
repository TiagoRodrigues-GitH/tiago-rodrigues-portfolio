package org.example;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.dto.request.ProjectRequest;
import org.example.dto.response.ProjectResponse;
import org.example.entity.Project;
import org.example.service.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Project endpoints through the real security chain: reads are public, changes need the ADMIN scope. */
@SpringBootTest(properties = {
        "app.jwt.secret=MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=",
        "app.cors.allowed-origins=https://tiagorodrigues-gith.github.io",
})
@AutoConfigureMockMvc
class ProjectControllerTest {

    private static final RequestPostProcessor ADMIN = jwt().authorities(new SimpleGrantedAuthority("SCOPE_ADMIN"));

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private ProjectService projectService;

    private ProjectResponse testResponse;
    private ProjectRequest testRequest;

    @BeforeEach
    void setUp() {
        testResponse = ProjectResponse.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .mediaType(Project.MediaType.IMAGE)
                .published(true)
                .build();

        testRequest = new ProjectRequest();
        testRequest.setTitle("New Project");
        testRequest.setDescription("New Description");
        testRequest.setMediaType(Project.MediaType.VIDEO);
        testRequest.setPublished(true);
    }

    @Test
    void anyoneListsPublishedProjects() throws Exception {
        when(projectService.getAllPublishedProjects()).thenReturn(List.of(testResponse));

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Project"))
                .andExpect(jsonPath("$[0].description").value("Test Description"));
    }

    @Test
    void anyoneReadsOneProject() throws Exception {
        when(projectService.getProjectById(1L)).thenReturn(testResponse);

        mockMvc.perform(get("/api/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Project"));
    }

    @Test
    void adminCreatesProject() throws Exception {
        when(projectService.createProject(any(ProjectRequest.class))).thenReturn(testResponse);

        mockMvc.perform(post("/api/projects").with(ADMIN)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Test Project"));
    }

    @Test
    void anonymousCannotCreateProject() throws Exception {
        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testRequest)))
                .andExpect(status().isUnauthorized());

        verify(projectService, never()).createProject(any(ProjectRequest.class));
    }

    @Test
    void adminDeletesProject() throws Exception {
        mockMvc.perform(delete("/api/projects/1").with(ADMIN))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Project deleted successfully"));

        verify(projectService).deleteProject(1L);
    }
}
